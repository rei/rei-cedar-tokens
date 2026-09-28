import https from 'node:https';
import { OutgoingHttpHeaders } from 'node:http';
import {
  GetLocalVariablesResponse,
  PostVariablesRequestBody,
  PostVariablesResponse,
} from '@figma/rest-api-spec';

/**
 * Client for interacting with the Figma REST API.
 *
 * Uses Node.js built-in https module for HTTP requests.
 */
export default class FigmaApi {
  private baseUrl = 'https://api.figma.com';
  private token: string;

  /**
   * Creates a new Figma API client.
   *
   * @param token - Personal access token for Figma API authentication
   */
  constructor(token: string) {
    this.token = token;
  }

  /**
   * Makes an HTTP request to the Figma API.
   *
   * @template T - The expected response type
   * @param path - API endpoint path (e.g., '/v1/files/{fileKey}/variables/local')
   * @param options - Additional request options (method, headers, etc.)
   * @param body - Request body for POST/PUT requests
   * @param redirectCount - Internal counter for redirect depth (max 5)
   * @returns Promise resolving to the parsed JSON response
   * @throws {Error} If request fails, receives non-2xx status, or exceeds redirect limit
   */
  private request<T>(
    path: string,
    options: https.RequestOptions & { method?: string } = {},
    body?: unknown,
    redirectCount = 0,
  ) {
    return new Promise<T>((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const payload = body ? JSON.stringify(body) : undefined;
      const method = options.method ?? 'GET';

      const headers: OutgoingHttpHeaders = {
        Accept: 'application/json',
        'X-Figma-Token': this.token,
      };

      if (
        options.headers &&
        typeof options.headers === 'object' &&
        !Array.isArray(options.headers)
      ) {
        Object.assign(headers, options.headers);
      }

      if (payload) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = Buffer.byteLength(payload);
      }

      const req = https.request(
        {
          protocol: url.protocol,
          hostname: url.hostname,
          path: `${url.pathname}${url.search}`,
          method,
          headers,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          res.on('end', () => {
            const text = Buffer.concat(chunks).toString('utf-8');
            const status = res.statusCode ?? 0;

            if (status >= 300 && status < 400 && res.headers.location) {
              if (redirectCount >= 5) {
                return reject(new Error('Too many redirects'));
              }
              return this.request<T>(res.headers.location, options, body, redirectCount + 1).then(
                resolve,
                reject,
              );
            }

            if (status < 200 || status >= 300) {
              return reject(new Error(`Figma API request failed (${status}): ${text}`));
            }

            try {
              resolve(text ? (JSON.parse(text) as T) : ({} as T));
            } catch (error) {
              reject(error);
            }
          });
        },
      );

      req.on('error', reject);

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  }

  /**
   * Retrieves all local variables from a Figma file.
   *
   * @param fileKey - The unique identifier for the Figma file
   * @returns Promise resolving to local variables response data
   */
  async getLocalVariables(fileKey: string) {
    return this.request<GetLocalVariablesResponse>(`/v1/files/${fileKey}/variables/local`);
  }

  /**
   * Creates or updates variables in a Figma file.
   *
   * @param fileKey - The unique identifier for the Figma file
   * @param payload - The variables request payload
   * @returns Promise resolving to the variables response data
   */
  async postVariables(fileKey: string, payload: PostVariablesRequestBody) {
    return this.request<PostVariablesResponse>(
      `/v1/files/${fileKey}/variables`,
      { method: 'POST' },
      payload,
    );
  }
}
