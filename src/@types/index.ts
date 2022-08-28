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

export interface Stats {
  [iconNameHash: string]: number
}

export interface IconStats {
  [streamer: string]: Stats
}

