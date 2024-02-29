import {parse} from 'graphql/language/parser';
import redis from './redis';

/*
 * handleQuery processes an incoming GraphQL query, checks for (partially) cached
 * responses in Redis, queries the database if necessary, and caches new data.
 */

export const handleQuery = async (query) => {
  // parse query and initialize count variables
  const parsedQuery = parse(query);
  let cacheHits = 0;
  let nonCache = 0;

  // extract fields requested in the GraphQL query to check the cache for each field
  const queryTypes = parsedQuery.definitions[0].selectionSet.selections;
  // create a map to store the caching status of each field
  const queryMap = new Map();
  queryTypes.forEach((type) => {
    const fields = type.selectionSet.selections;
    fields.forEach((field) => {
      const key = {
        type: type.name.value,
        args: type.arguments,
        field: field.name.value,
      };
      // stringify key object for storage in queryMap
      queryMap.set(JSON.stringify(key), null);
    });
  });

  // try to populate queryMap from Redis cache
  for (const keyString of queryMap.keys()) {
    const result = await redis.get(keyString);
    if (result !== null) {
      cacheHits++;
      queryMap.set(keyString, result);
    } else {
      nonCache++;
    }
  }

  // check whether all fields were found in the cache
  let allFieldsCached = true;
  for (const keyString of queryMap.keys()) {
    if (!queryMap.get(keyString)) allFieldsCached = false;
  }

  // if so, build and return response object
  if (allFieldsCached) {
    const gqlResponse = {cacheHits, nonCache, response: {}};
    const type = JSON.parse(queryMap.keys().next().value).type;
    gqlResponse.response[type] = {};
    for (let [keyString, value] of queryMap) {
      const key = JSON.parse(keyString);
      gqlResponse.response[type][key.field] = value;
    }
    return gqlResponse;
  } // if not, build a sub query for fields not found in the cache
  else {
    // create an array of fields to fetch if their value was not cached
    const fieldsToFetch = [];
    for (const [keyString, value] of queryMap) {
      if (value === null) {
        fieldsToFetch.push(JSON.parse(keyString));
      }
    }

    // start constructing the actual sub query string
    let type = '';
    let args = '';
    let fields = '';
    if (fieldsToFetch.length > 0) {
      type += fieldsToFetch[0].type;
      // if subquery includes arguments, include them in the new query
      if (fieldsToFetch[0].args.length !== 0) {
        args += '(';
        fieldsToFetch[0].args.forEach((el) => {
          args += el.name.value + ': "' + el.value.value + '"';
        });
        args += ')';
      }
    }
    // prepare specified fields to be added to the query string
    for (let i = 0; i < fieldsToFetch.length; i++) {
      fields += fieldsToFetch[i].field + ', ';
    }
    // construct GraphQL query string, including type, args (if given) and requested fields
    const fullQuery = `query { ${type} ${args} {${fields}} }`;

    // send sub query string to graphql route
    const gqlResponse = await fetch(
      `http://localhost:${Bun.env.PORT}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: fullQuery}),
      }
    );
    let parsedResponse = await gqlResponse.json();

    // error handling for undefined query types
    if (parsedResponse.errors) {
      const errorObject = parsedResponse.errors[0];
      return {
        response: {
          message: errorObject.message,
          errors: errorObject,
        },
      };
    }

    // if no error, access the response data
    parsedResponse = parsedResponse.data;

    // error handling for allowed query types
    for (const [key, value] of Object.entries(parsedResponse)) {
      if (value === null || value === undefined) {
        return {
          response: {
            message: `Invalid query for ${key}!`,
            errors: parsedResponse,
          },
        };
      }
    }

    // cache the new data received from Redis
    let iterator = queryMap.keys();
    const ref = {};
    for (let _key of iterator) {
      _key = JSON.parse(_key);
      ref[_key.field] = _key;
    }

    // traverse the AST, saving the value for each field
    for (const [name, fields] of Object.entries(parsedResponse)) {
      for (const [field, fieldVal] of Object.entries(fields)) {
        // update queryMap with the new data for each field
        queryMap.set(JSON.stringify(ref[field]), fieldVal);
        // update the cache using the key from the reference object
        redis.set(JSON.stringify(ref[field]), fieldVal);
      }
    }

    // build and return response object
    const queryRes = {cacheHits, nonCache, response: {}};
    const newType = JSON.parse(queryMap.keys().next().value).type;
    queryRes.response[newType] = {};
    for (let [keyStr, value] of queryMap) {
      const key = JSON.parse(keyStr);
      queryRes.response[newType][key.field] = value;
    }
    return queryRes;
  }
};
