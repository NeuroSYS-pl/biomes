export class KeyError extends Error {
  constructor(key: unknown) {
    super(`The key "${key}" does not exist!`);
  }
}
