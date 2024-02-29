import { parse } from 'graphql/language/parser';
import redis from './redis';

export const handleQuery = async (query) => {
  const parsedQuery = parse(query);
  let cacheHits = 0;
  let nonCache = 0;

  const queryTypes = parsedQuery.definitions[0].selectionSet.selections;
  const queryObj = {};
  queryTypes.forEach((type) => {
    const fields = type.selectionSet.selections;
    fields.forEach((field) => {
      const key = JSON.stringify({
        type: type.name.value,
        args: type.arguments,
        field: field.name.value,
      });
      queryObj[key] = null;
    });
  });

  for (const keyString in queryObj) {
    const result = await redis.get(keyString);
    if (result !== null) {
      cacheHits++;
      queryObj[keyString] = result;
    } else {
      nonCache++;
    }
  }

  let allFieldsCached = !Object.values(queryObj).includes(null);

  if (allFieldsCached) {
    const gqlResponse = { cacheHits, nonCache, response: {} };
    const type = JSON.parse(Object.keys(queryObj)[0]).type;
    gqlResponse.response[type] = {};
    for (let keyString in queryObj) {
      const key = JSON.parse(keyString);
      gqlResponse.response[type][key.field] = queryObj[keyString];
    }
    return gqlResponse;
  } else {
    const fieldsToFetch = [];
    for (const keyString in queryObj) {
      if (queryObj[keyString] === null) {
        fieldsToFetch.push(JSON.parse(keyString));
      }
    }

    let type = '', args = '', fields = '';
    if (fieldsToFetch.length > 0) {
      type += fieldsToFetch[0].type;
      if (fieldsToFetch[0].args.length !== 0) {
        args += '(' + fieldsToFetch[0].args.map(el => `${el.name.value}: "${el.value.value}"`).join(', ') + ')';
      }
      fields = fieldsToFetch.map(f => f.field).join(', ');
    }
    const fullQuery = `query { ${type} ${args} { ${fields} } }`;

    const gqlResponse = await fetch(`http://localhost:${Bun.env.PORT}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: fullQuery }),
    });
    let parsedResponse = await gqlResponse.json();

    if (parsedResponse.errors) {
      return { response: { message: parsedResponse.errors[0].message, errors: parsedResponse.errors[0] } };
    }

    parsedResponse = parsedResponse.data;

    for (const [key, value] of Object.entries(parsedResponse)) {
      if (value === null || value === undefined) {
        return { response: { message: `Invalid query for ${key}!`, errors: parsedResponse } };
      }
    }

    const ref = {};
    Object.keys(queryObj).forEach(keyStr => {
      const key = JSON.parse(keyStr);
      ref[key.field] = keyStr; // Store stringified key for later reference
    });

    for (const [name, fields] of Object.entries(parsedResponse)) {
      for (const [field, fieldVal] of Object.entries(fields)) {
        const keyStr = ref[field]; // Retrieve the stringified key
        queryObj[keyStr] = fieldVal; // Update with new data
        redis.set(keyStr, fieldVal); // Update cache
      }
    }

    const queryRes = { cacheHits, nonCache, response: {} };
    const newType = JSON.parse(Object.keys(queryObj)[0]).type;
    queryRes.response[newType] = {};
    for (let keyStr in queryObj) {
      const key = JSON.parse(keyStr);
      queryRes.response[newType][key.field] = queryObj[keyStr];
    }
    return queryRes;
  }
};
