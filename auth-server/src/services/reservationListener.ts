import MqttService from '../services/mqtt';

const url = process.env.MQTT_URL || 'mqtt://localhost';
const topic = process.env.RESERVATION_TOPIC || 'temp';

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

  private listener = (_: string, message: string) => {
    try {
      const parsed = JSON.parse(message);

      if (!this.reservations[parsed.nextId]) {
        this.reservations[parsed.nextId] = [];
      }

      this.reservations[parsed.nextId].push({
        startTime: new Date(parsed.nextStartTime),
        endTime: new Date(parsed.nextEndTime),
      });
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