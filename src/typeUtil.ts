import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

/**
 * Parse string into statically typed type. Fail fast if the format does not
 * match. See environment.ts for example usage.
 */
export const unsafeDecode = <A>(d: t.Decoder<unknown, A>, value: unknown) => {
  const decoded = d.decode(value);

  return decoded.getOrElseL(() => {
    PathReporter.report(decoded).forEach(error => {
      console.error(error);
    });

    throw new Error('failed to parse type');
  });
};
