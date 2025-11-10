/**
 * Chat Types
 * Types for chatbot AI feature
 */

export interface RecommendedMovie {
  movieId: number;
  name: string;
  slug?: string | null;
  poster?: string | null;
  ageRating?: string | null;
  rating?: number | null;
  genres?: string[] | null;
  genreDisplayNames?: string[] | null;
  reasons?: string[] | null;
  showtimes?: string[] | null;
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
