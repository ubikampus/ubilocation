declare module 'node-jose';
declare module 'ubimqtt' {
  class UbiMqtt {
    constructor(address: string);
    connect(callback: any): void;
    disconnect(callback: any): void;
    publish(topic: string, message: string, opts: any, callback: any): void;
    publishSigned(
      topic: string,
      message: string,
      opts: any,
      privateKey: any,
      callback: any
    ): void;
    subscribe(topic: string, obj: any, listener: any, callback: any): void;
    subscribeSigned(
      topic: string,
      publicKeys: any[],
      obj: any,
      listener: any,
      callback: any
    ): void;
  }
  export = UbiMqtt;
}

