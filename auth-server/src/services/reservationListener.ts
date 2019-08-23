import MqttService from '../services/mqtt';
import fs from 'fs';

const url = process.env.MQTT_URL || 'mqtt://localhost';
const topic = process.env.RESERVATION_TOPIC || 'rooms/+/reservations/#';
const publicKeyPath = process.env.KEY_PATH || 'pkey.pem';

let publicKey: string;
try {
  publicKey = fs.readFileSync(publicKeyPath).toString();
} catch (err) {
  console.error(err);
}
interface Reservation {
  startTime: Date;
  endTime: Date;
}

interface Rooms {
  [room: string]: {
    reservations: Reservation[];
    free: boolean;
  };
}

export default class ReservationListener {
  public rooms: Rooms = {};

  constructor() {
    new MqttService()
      .connect(url)
      .then(s => s.subscribeSigned(topic, [publicKey], this.listener));
  }

  addReservation(room: string, reservation: Reservation) {
    if (!this.rooms[room]) {
      this.rooms[room] = {
        free: false,
        reservations: [],
      };
    }

    this.rooms[room].reservations.push(reservation);
  }

  getReservations(room: string): Reservation[] {
    return this.rooms[room].reservations;
  }

  public listener = (messageTopic: string, message: string) => {
    const room = messageTopic.split('/')[1];

    try {
      const parsed = JSON.parse(message);

      if (messageTopic.includes('ending')) {
        this.addReservation(room, {
          startTime: new Date(parsed.nextStartTime),
          endTime: new Date(parsed.nextEndTime),
        });
      } else {
        this.addReservation(room, {
          startTime: new Date(parsed.currentStartTime),
          endTime: new Date(parsed.currentEndTime),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  public update() {
    const newRooms: Rooms = {};
    const now = new Date();

    for (const item of Object.entries(this.rooms)) {
      const filtered = item[1].reservations.filter(i => i.endTime > now);

      newRooms[item[0]] = {
        free: filtered.every(a => a.startTime > now),
        reservations: filtered,
      };
    }

    this.rooms = newRooms;
  }
}
