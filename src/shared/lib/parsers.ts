import { createParser } from 'nuqs';

/**
 * Custom Nuqs parser for Base64 encoded JSON
 * Useful for 'encrypting' (obfuscating) complex URL parameters
 */
export const parseAsBase64Json = <T>(defaultValue?: T) => {
  const parser = createParser<T>({
    parse: (query) => {
      try {
        return JSON.parse(atob(query));
      } catch (e) {
        return null;
      }
    },
    serialize: (value) => {
      try {
        return btoa(JSON.stringify(value));
      } catch (e) {
        return "";
      }
    },
    eq: (a, b) => JSON.stringify(a) === JSON.stringify(b)
  });

  return defaultValue !== undefined ? parser.withDefault(defaultValue as NonNullable<T>) : parser;
};
