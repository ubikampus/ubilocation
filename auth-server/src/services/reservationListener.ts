import MqttService from '../services/mqtt';

const url = process.env.MQTT_URL || 'mqtt://localhost';
const topic = process.env.RESERVATION_TOPIC || 'rooms/+/reservations/#';

interface Reservation {
  startTime: Date;
  endTime: Date;
}

interface Reservations {
  [room: string]: Reservation[];
}

export default class ReservationListener {
  public reservations: Reservations = {};

  constructor() {
    new MqttService().connect(url).then(s => s.subscribe(topic, this.listener));
  }

  public listener = (messageTopic: string, message: string) => {
    const room = messageTopic.split('/')[1];
    try {
      const parsed = JSON.parse(message);
      const payload = JSON.parse(parsed.payload);

      if (!this.reservations[room]) {
        this.reservations[room] = [];
      }

      if (messageTopic.includes('ending')) {
        this.reservations[room].push({
          startTime: new Date(payload.nextStartTime),
          endTime: new Date(payload.nextEndTime),
        });
      } else {
        this.reservations[room].push({
          startTime: new Date(payload.currentStartTime),
          endTime: new Date(payload.currentEndTime),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  public filter() {
    const newReservations: Reservations = {};
    const now = new Date();
    for (const item of Object.entries(this.reservations)) {
      const filtered = item[1].filter(i => i.endTime > now);
      newReservations[item[0]] = filtered;
    }

    this.reservations = newReservations;
  }
}
