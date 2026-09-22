import { test, expect } from '@playwright/test';

test.describe('API Health & Validation', () => {
  test('should fetch user details successfully via GET', async ({ request }) => {
    // 1. Send GET request to a public mock API
    const response = await request.get('https://reqres.in/api/users/2');

    // 2. Validate HTTP Status Code
    expect(response.status()).toBe(200);

    // 3. Validate JSON payload structure
    const responseBody = await response.json();
    expect(responseBody.data.id).toBe(2);
    expect(responseBody.data.email).toContain('@reqres.in');
    expect(responseBody.data).toHaveProperty('first_name', 'Janet');
  });
});