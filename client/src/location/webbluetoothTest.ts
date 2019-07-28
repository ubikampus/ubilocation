import { TextDecoder, TextEncoder } from 'util';

import fetchName from './webbluetooth';

describe('web bluetooth', () => {
  it('fetches bluetooth name successfully', async () => {
    (global as any).TextDecoder = TextDecoder;
    const encoder = new TextEncoder();
    const btName = encoder.encode('android-123');

    // nice
    (navigator.bluetooth as any) = {
      requestDevice: () =>
        Promise.resolve({
          gatt: {
            connect: () =>
              Promise.resolve({
                getPrimaryService: () =>
                  Promise.resolve({
                    getCharacteristic: () =>
                      Promise.resolve({
                        getDescriptor: () =>
                          Promise.resolve({
                            readValue: () => Promise.resolve(btName),
                          }),
                      }),
                  }),
              }),
          },
        }),
    };

    const name = await fetchName();
    expect(name).toBe('android-123');
  });

  it('returns empty if device doesnt support bluetooth', async () => {
    (navigator.bluetooth as any) = undefined;
    await expect(fetchName()).rejects.toThrow(/not supported/);
  });
});
