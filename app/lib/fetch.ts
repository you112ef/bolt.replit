type CommonRequest = Omit<RequestInit, 'body'> & { body?: URLSearchParams };

/**
 * A wrapper around fetch, providing environment-specific logic for Node.js (development) and browser.
 *
 * IMPORTANT: Callers of this function should implement proper error handling.
 * This includes:
 *  - Checking `response.ok` to ensure the HTTP request was successful (status in the range 200-299).
 *  - Handling potential exceptions from the `fetch` call itself (e.g., network errors).
 *  - Parsing the response body (e.g., `response.json()`, `response.text()`) can also throw errors.
 *
 * Example:
 * try {
 *   const response = await request('https://api.example.com/data');
 *   if (!response.ok) {
 *     throw new Error(`HTTP error! status: ${response.status}`);
 *   }
 *   const data = await response.json();
 *   // process data
 * } catch (error) {
 *   console.error('Failed to fetch data:', error);
 *   // handle error appropriately
 * }
 *
 * Consider creating a `safeRequest` wrapper that includes this boilerplate error handling
 * if it's commonly needed across multiple call sites.
 */
export async function request(url: string, init?: CommonRequest) {
  if (import.meta.env.DEV) {
    const nodeFetch = await import('node-fetch');
    const https = await import('node:https');

    const agent = url.startsWith('https') ? new https.Agent({ rejectUnauthorized: false }) : undefined;

    return nodeFetch.default(url, { ...init, agent });
  }

  return fetch(url, init);
}
