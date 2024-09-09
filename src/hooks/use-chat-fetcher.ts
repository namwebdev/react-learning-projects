import { useSocket } from "@/providers/websocket.provider";
import { MessageWithUser } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

type ChatFetcherProps = {
  queryKey: string;
  apiUrl: string;
  paramKey?: "channelId" | "recipientId";
  paramValue: string;
  pageSize: number;
};

export const useChatFetcher = ({
  apiUrl,
  queryKey,
  pageSize,
  paramKey = "channelId",
  paramValue,
}: ChatFetcherProps) => {
  const { isConnected } = useSocket();

  const fetcher = async ({
    pageParam = 0,
  }: any): Promise<{ data: MessageWithUser[] }> => {
    const url = `${apiUrl}?${paramKey}=${encodeURIComponent(
      paramValue
    )}&page=${pageParam}&size=${pageSize}`;

    const response = await fetch(url);
    const data = (await response.json()) as MessageWithUser

    return data as any;
  };

  return useInfiniteQuery<{ data: MessageWithUser[] }, Error>({
    queryKey: [queryKey, paramValue],
    queryFn: fetcher,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data?.length === pageSize ? allPages.length : undefined,
    refetchInterval: isConnected ? false : 1000,
    retry: 3,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    initialPageParam: 0,
  });
};
