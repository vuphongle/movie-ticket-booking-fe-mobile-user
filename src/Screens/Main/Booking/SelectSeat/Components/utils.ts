import { SeatDto } from "@Types/auditoriumTypes";

export type SeatType = "normal" | "vip" | "couple";
export type SeatStatus = "active" | "inactive" | "booked";
export type ReservationStatus = "booked" | "held" | "cancelled";

export interface Seat {
  id: number;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  reservationStatus: ReservationStatus;
  price: number;
  priceId?: number;
}

export const letterFromIndex = (idx: number) => String.fromCharCode("A".charCodeAt(0) + (idx - 1));

export const mapSeatType = (t: SeatDto["type"]): SeatType =>
  t === "VIP" ? "vip" : t === "COUPLE" ? "couple" : "normal";

export const mapSeatStatus = (
  status: boolean,
  reservation: SeatDto["reservationStatus"]
): SeatStatus => {
  if (!status) return "inactive";
  if (reservation === "BOOKED") return "booked";
  return "active";
};

export const mapReservationStatus = (
  reservation: SeatDto["reservationStatus"]
): ReservationStatus => {
  switch (reservation) {
    case "BOOKED":
      return "booked";
    case "HELD":
      return "held";
    case "CANCELLED":
      return "cancelled";
    default:
      return "cancelled";
  }
};
