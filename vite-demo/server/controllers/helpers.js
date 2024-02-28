import { parse } from 'graphql/language/parser';
import redis from './redis';

export const handleQuery = async (query) => {
  const parsedQuery = parse(query);
  let cacheHits = 0;
  let nonCache = 0;

  // split queries by field
  // access the array of type objects
  const types = parsedQuery.definitions[0].selectionSet.selections;
  const queryMap = new Map();
  types.forEach((type) => {
    const fields = type.selectionSet.selections;
    // iterate through fields array
    fields.forEach((field) => {
      // add each field as a key to keys
      const key = {
        type: type.name.value,
        args: type.arguments,
        field: field.name.value,
      };
      // put key obj in keys map
      queryMap.set(JSON.stringify(key), null);
    });
  });

  // populate keyMap from cache
  for (const keyString of queryMap.keys()) {
    const key = JSON.parse(keyString);
    const result = await redis.get(keyString);
    if (result !== null) {
      cacheHits++;
      queryMap.set(keyString, result);
    } else {
      nonCache++;
    }
  }

  // check for values
  let allVals = true;
  for (const keyString of queryMap.keys()) {
    const key = JSON.parse(keyString);
    if (!queryMap.get(keyString)) allVals = false;
  }
  console.log('allVals? ', allVals);
  console.log('cache hits ', cacheHits);
  console.log('non-cache hits ', nonCache);

  // send response object if allVals
  if (allVals) {
    const res = { source: 'cache', response: {} };
    const type = JSON.parse(queryMap.keys().next().value).type;
    res.response[type] = {};
    for (let [keyString, value] of queryMap) {
      const key = JSON.parse(keyString);
      res.response[type][key.field] = value;
    }
    return { 'queryRes': res, cacheHits, nonCache };
  } else {
    // build sub query
    const subQuery = [];
    for (const [keyString, value] of queryMap) {
      if (value === null) {
        subQuery.push(JSON.parse(keyString));
      }
    }

    let type = '';
    let arg = '';
    let fields = '';
    if (subQuery.length > 0) {
      type += subQuery[0].type;
      if (subQuery[0].args.length !== 0) {
        arg += '(';
        subQuery[0].args.forEach((el) => {
          arg += el.name.value + ': "' + el.value.value + '"';
        });
        arg += ')';
      }
    }
    for (let i = 0; i < subQuery.length; i++) {
      fields += subQuery[i].field + ', ';
    }
    const fullQuery = `query { ${type} ${arg} {${fields}} }`;

    // send subquery to db
    const res = await fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: fullQuery }),
    });
    let parsed = await res.json();
    parsed = parsed.data;

    // save back to redis
    let iterator = queryMap.keys();
    const ref = {};
    for (let _key of iterator) {
      _key = JSON.parse(_key);
      ref[_key.field] = _key;
    }
    for (const [name, fields] of Object.entries(parsed)) {
      const fields2 = fields;
      for (const [field, fieldVal] of Object.entries(fields2)) {
        queryMap.set(JSON.stringify(ref[field]), fieldVal);
        const redisKey = JSON.stringify(ref[field]);
        await redis.set(redisKey, fieldVal);
      }
    }

    // send response
    const queryRes = { source: 'database', response: {} };
    const newType = queryMap.keys().next().value.type;
    queryRes.response[newType] = {};
    for (let [key, value] of queryMap) {
      key = JSON.parse(key);
      queryRes.response[newType][key.field] = value;
    }
    return { queryRes, cacheHits, nonCache};
  }
};
