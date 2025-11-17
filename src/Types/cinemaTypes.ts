export interface Cinema {
  id: number;
  name: string;
  address: string;
  mapLocation: string;
}

export interface Auditorium {
  id: number;
  name: string;
  totalSeats: number;
}

export interface CinemaListResponse {
  content: Cinema[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CinemaServiceInterface {
  getAllCinemaNames: () => Promise<string[]>;
  getAllCities: () => Promise<string[]>;
  getAllCinemas: () => Promise<Cinema[]>;
  getCinemaById: (cinemaId: number) => Promise<Cinema>;
  getAuditoriumsByCinemaId: (cinemaId: number) => Promise<Auditorium[]>;
}
