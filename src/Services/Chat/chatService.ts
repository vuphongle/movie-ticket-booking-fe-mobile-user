import { httpService } from "../httpService";
import type { ChatRecommendationRequest, ChatRecommendationResponse } from "@Types/chatTypes";
import { endpoints } from "@Constants";

/**
 * Send a message to chatbot and get recommendations
 * No authentication required (supports both guest and logged-in users)
 */
export const getRecommendations = async (
  request: ChatRecommendationRequest
): Promise<ChatRecommendationResponse> => {
  const response = await httpService.post<ChatRecommendationResponse>(
    endpoints.CHAT.GET_RECOMMENDATIONS,
    request,
    {
      skipAuth: true, // Allow guest users
    }
  );

  return response;
};

export const chatService = {
  getRecommendations,
};

/**
 * React Query keys for chat queries
 */
export const chatKeys = {
  all: ["chat"] as const,
  recommendations: () => [...chatKeys.all, "recommendations"] as const,
};
