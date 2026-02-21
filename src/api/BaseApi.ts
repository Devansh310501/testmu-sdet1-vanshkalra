import { APIRequestContext } from '@playwright/test';

/**
 * Sample API helper function.
 * Replace this with actual API calls for your application.
 *
 * Usage:
 *   const response = await sampleGetRequest(request, '/endpoint');
 */
export async function sampleGetRequest(
    request: APIRequestContext,
    endpoint: string,
): Promise<unknown> {
    const response = await request.get(endpoint);
    return response.json();
}
