/**
 * Chat Types
 * Types for chatbot AI feature
 */

export interface RecommendedMovie {
  movieId: number;
  name: string;
  nameEn?: string | null;
  slug?: string | null;
  poster?: string | null;
  ageRating?: string | null;
  rating?: number | null;
  genres?: string[] | null;
  genreDisplayNames?: string[] | null;
  reasons?: string[] | null;
  showtimes?: RecommendedShowtime[] | null;
}

export interface RecommendedShowtime {
  id: number;
  date: number[] | string;
  startTime: string;
  endTime?: string | null;
  graphicsType?: string | null;
  translationType?: string | null;
  cinemaId?: number | null;
  cinemaName?: string | null;
  cinemaAddress?: string | null;
  auditoriumId?: number | null;
  auditoriumName?: string | null;
  auditoriumType?: string | null;
  auditoriumTotalSeats?: number | null;
  auditoriumTotalRows?: number | null;
  auditoriumTotalColumns?: number | null;
}

export interface ChatRecommendationRequest {
  message: string;
  language?: string;
  conversationId?: string;
}

export interface ChatRecommendationResponse {
  conversationId: string;
  answer: string;
  recommendedMovies?: RecommendedMovie[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  movies?: RecommendedMovie[];
  variant?: "default" | "error";
  timestamp?: number;
}

export interface ConversationHistory {
  conversationId: string;
  messages: ChatMessage[];
  lastUpdated: number;
}
