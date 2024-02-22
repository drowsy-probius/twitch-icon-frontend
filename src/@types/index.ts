export const STREAM_PLATFORM = ["twitch", "chzzk", "youtube"] as const;

export type StreamPlatform = typeof STREAM_PLATFORM[number];

type StreamPlatformWithoutTwitch = Exclude<StreamPlatform, "twitch">;


export interface StreamerData {
  name: {
    twitch: string;
  } & { [key in StreamPlatformWithoutTwitch]: string | null };
  url: string;
  type: number;

  imagePrefix?: string;
  id?: {
    twitch: number;
  } & { [key in StreamPlatformWithoutTwitch]: number | null };
  nickname?: string;
}

export interface Icon {
  name: string,
  keywords: string[],
  nameHash: string,
  originUri: string,
  tags: string[],
  thumbnailUri: string,
  uri: string,
  useOrigin: boolean,
  streamer?: string,
}

export interface IconList {
  icons: Icon[],
  timestamp: number
}

export interface IconMetatdata {
  [streamer: string] : IconList
}

export interface IconWithStats extends Icon {
  stats: number,
  streamer: string,
}
