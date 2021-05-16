/**
 * Implements lazy initialization for getter or memoization of a function call similar to pure {@link: Pipe}.
 * Replaces getter with its calculated value upon first call or keeps track of last call arguments and returned
 * value for function, skipping calculation when arguments are strictly the same.
 */
export function Pure<T>(
  // tslint:disable-next-line:variable-name
  _target: {},
  propertyKey: string,
  { enumerable, value }: TypedPropertyDescriptor<T>,
): TypedPropertyDescriptor<T> {
  if (typeof value !== 'function') {
    throw new Error('Pure can only be used with functions or getters');
  }

  const original = value;

  return {
    enumerable,
    get(): T {
      let previousArgs: ReadonlyArray<unknown> = [];
      let previousResult: T;

      const patched = (...args: Array<unknown>) => {
        if (
          previousArgs.length === args.length &&
          args.every((arg, index) => arg === previousArgs[index])
        ) {
          return previousResult;
        }

        previousArgs = args;
        previousResult = original(...args);

        return previousResult;
      };

      Object.defineProperty(this, propertyKey, {
        value: patched,
      });

      return patched as any;
    },
  };
}
