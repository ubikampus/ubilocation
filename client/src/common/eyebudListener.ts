interface EyebudPhotoEvent {
  from: string;
  time: string;
  tag: string;
  image: string;
}

export class EyebudListener {
  private url: string;
  private socket: WebSocket | null;
  constructor(url: string) {
    this.url = url;
    this.socket = null;
  }

  imageEventListener(
    id: string,
    callback: (image: string) => void,
    stream = false
  ) {
    this.socket = new WebSocket(this.url);
    this.socket.onmessage = (message: MessageEvent) => {
      const event: EyebudPhotoEvent = JSON.parse(message.data);
      if (event.from === id) {
        callback(event.image);
        if (!stream) {
          if (this.socket) {
            this.socket.close();
          }
        }
      }
    };
  }

  stopListening() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
