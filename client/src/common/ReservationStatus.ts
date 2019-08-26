import authApi, { Rooms } from '../admin/authApi';

class ReservationStatus {
  public rooms: Rooms = {};

  public async update() {
    this.rooms = await authApi.reservations();
  }

  public getRoomStatus(room: string): boolean {
    return this.rooms[room].free;
  }
}