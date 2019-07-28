export type BluetoothFetchResult =
  | { kind: 'fail' }
  | { kind: 'loading' }
  | { kind: 'success'; name: string };
