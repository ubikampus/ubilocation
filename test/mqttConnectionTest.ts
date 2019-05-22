import { connectUbiTopic } from '../src/mqttConnection';

const subscribeMock = jest
  .fn()
  .mockImplementation((topic: any, a: any, onMsg: any, onReady) => {
    onReady(null);
  });

jest.mock('ubimqtt', () => {
  return jest.fn().mockImplementation(() => {
    return {
      subscribe: subscribeMock,
      connect: (cb: any) => cb(),
    };
  });
});

describe('ubimqtt connection', () => {
  it('should pass topic for the subscribe method', done => {
    connectUbiTopic(
      'mqtt://ubimock:3333',
      'ohtu/kaista',
      () => {},
      () => {
        expect(subscribeMock).toBeCalledWith(
          'ohtu/kaista',
          null,
          expect.any(Function),
          expect.any(Function)
        );
        done();
      }
    );
  });
});
