import { expect, test, describe, /* beforeAll, beforeEach */ } from 'bun:test';

describe('GraphQL route', () => {
  describe('POST', () => {
    test('adding user is successful', async () => {
      const data = await fetch('http://localhost:8080/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: 'mutation { addRandomUsers(num: 1) { id username email birthdate registeredAt } }' })
      })
      expect(data.json()).resolves.toEqual(expect.objectContaining({
        data: expect.any(Object),
      }));
    })
    test('adding random user returns a successful status code', async () => {
      const data = await fetch('http://localhost:8080/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: 'mutation { addRandomUsers(num: 1) { id username email birthdate registeredAt } }' })
      })
      expect(data.status).toBe(200);
    })
    test('rejects queries with forbidden characters', async () => {
      const data = await fetch('http://localhost:8080/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: '{ getUserById(id: "65cdf731aeda2e240baec9fd" OR 1=1) { id username email }' })
      })
      expect(data.status).toBe(403);
    })
  })
})