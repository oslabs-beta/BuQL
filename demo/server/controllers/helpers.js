// Import adjustments
import { parse } from 'graphql/language/parser';
import redis from './redis';

// Asynchronous function to process a GraphQL request
export const processRequest = async (input) => {
  const parsedData = parse(input);
  let cacheHits = 0,
    missedCache = 0;

  // Extract definitions from the parsed GraphQL query for processing
  const dataDefinitions = parsedData.definitions[0].selectionSet.selections;
  const data = {};
  dataDefinitions.forEach((def) => {
    const elements = def.selectionSet.selections;
    elements.forEach((element) => {
      const identifier = JSON.stringify({
        definitionType: def.name.value,
        parameters: def.arguments,
        element: element.name.value,
      });
      data[identifier] = null;
    });
  });

  // Interact with the cache to retrive stored data or mark as missed
  for (const id in data) {
    const cacheResult = await redis.retrieve(id);
    if (cacheResult !== null) {
      cacheHits++;
      data[id] = cacheResult;
    } else {
      missedCache++;
    }
  }

  // Prepare response based on cache hits
  // If complete data is cached, construct the response directly
  let completeCache = !Object.values(data).includes(null);
  if (completeCache) {
    let response = { cacheHits, missedCache, response: {} };
    const dataType = JSON.parse(Object.keys(data)[0]).definitionType;
    response.response[dataType] = {};
    Object.keys(data).forEach((id) => {
      const keyDetails = JSON.parse(id);
      response.response[dataType][keyDetails.element] = data[id];
    });
    return response;
  } else {
    // Handling cases where cache misses occur by fetching missing data
    let fetchFields = [];
    Object.keys(data).forEach((id) => {
      if (data[id] === null) fetchFields.push(JSON.parse(id));
    });

    // Construct a new GraphQL query for missing data
    let dataType = '',
      params = '',
      elements = '';
    if (fetchFields.length) {
      dataType += fetchFields[0].definitionType;
      if (fetchFields[0].parameters.length) {
        params +=
          '(' +
          fetchFields[0].parameters
            .map((p) => `${p.name.value}: "${p.value.value}"`)
            .join(', ') +
          ')';
      }
      elements = fetchFields.map((f) => f.element).join(', ');
    }
    const newQuery = `query { ${dataType} ${params} { ${elements} } }`;

    // Fetching missing data from the server and update the cache
    const serverResponse = await fetch(
      `http://localhost:${Bun.env.PORT}/graphql`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: newQuery }),
      }
    );
    let fetchedData = await serverResponse.json();

    // Handle errors in fetched data
    if (fetchedData.errors) {
      return {
        data: {
          message: fetchedData.errors[0].message,
          errors: fetchedData.errors[0],
        },
      };
    }

    // Update cache with newly fetched data and prepare final response
    fetchedData = fetchedData.data;
    Object.keys(data).forEach((id) => {
      const detail = JSON.parse(id);
      if (fetchedData[detail.element] !== undefined) {
        data[id] = fetchedData[detail.element];
        redis.store(id, fetchedData[detail.element]);
      }
    });

    // Construct final response with updated cache data
    let finalResponse = { cacheHits, missedCache, response: {} };
    const updatedType = JSON.parse(Object.keys(data)[0]).definitionType;
    finalResponse.response[updatedType] = {};
    Object.keys(data).forEach((id) => {
      const detail = JSON.parse(id);
      finalResponse.response[updatedType][detail.element] = data[id];
    });
    return finalResponse;
  }
};

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

    let type = '',
      args = '',
      fields = '';
    if (fieldsToFetch.length > 0) {
      type += fieldsToFetch[0].type;
      if (fieldsToFetch[0].args.length !== 0) {
        args +=
          '(' +
          fieldsToFetch[0].args
            .map((el) => `${el.name.value}: "${el.value.value}"`)
            .join(', ') +
          ')';
      }
      fields = fieldsToFetch.map((f) => f.field).join(', ');
    }
    const fullQuery = `query { ${type} ${args} { ${fields} } }`;

    const gqlResponse = await fetch(
      `http://localhost:${Bun.env.PORT}/graphql`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: fullQuery }),
      }
    );
    let parsedResponse = await gqlResponse.json();

    if (parsedResponse.errors) {
      return {
        response: {
          message: parsedResponse.errors[0].message,
          errors: parsedResponse.errors[0],
        },
      };
    }

    parsedResponse = parsedResponse.data;

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

    const storage = {};
    Object.keys(queryObj).forEach((keyStr) => {
      const key = JSON.parse(keyStr);
      storage[key.field] = keyStr; // Store stringified key for later reference
    });

    for (const [name, fields] of Object.entries(parsedResponse)) {
      for (const [field, fieldVal] of Object.entries(fields)) {
        const newKey = storage[field];
        queryObj[newKey] = fieldVal;
        redis.set(newKey, fieldVal);
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
