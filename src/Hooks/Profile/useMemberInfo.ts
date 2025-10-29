import { useQuery } from "@tanstack/react-query";
import { fetchMemberInfo, profileKeys } from "@Services/Profile/profileService";
import { useMemo } from "react";
import type { MemberInfo } from "@Types/profile/profileTypes";

/**
 * Hook to fetch and manage member information
 */
export const useMemberInfo = () => {
  return useQuery({
    queryKey: profileKeys.member(),
    queryFn: fetchMemberInfo,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook to calculate member points progress
 */
export const useMemberProgress = () => {
  const { data: memberInfo, isLoading } = useMemberInfo();

  const progress = useMemo(() => {
    if (!memberInfo) {
      return {
        currentPoints: 0,
        nextTierPoints: 0,
        pointsNeeded: 0,
        progressPercentage: 0,
      };
    }

    const pointsNeeded = Math.max(
      0,
      memberInfo.nextTierPoints - memberInfo.points
    );
    const progressPercentage =
      memberInfo.nextTierPoints > 0
        ? (memberInfo.points / memberInfo.nextTierPoints) * 100
        : 0;

    return {
      currentPoints: memberInfo.points,
      nextTierPoints: memberInfo.nextTierPoints,
      pointsNeeded,
      progressPercentage: Math.min(100, progressPercentage),
    };
  }, [memberInfo]);

  return {
    memberInfo,
    progress,
    isLoading,
  };
};

/**
 * Hook to get member data safely
 */
export const useMemberData = (): MemberInfo | null => {
  const { data } = useMemberInfo();
  return data ?? null;
};
