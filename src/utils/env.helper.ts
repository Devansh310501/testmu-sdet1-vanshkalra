/**
 * Utility to safely read environment variables.
 *
 * @param key - The environment variable name
 * @param fallback - Optional default value if the variable is not set
 * @returns The environment variable value or the fallback
 */
export function getEnv(key: string, fallback: string = ''): string {
    return process.env[key] ?? fallback;
}
