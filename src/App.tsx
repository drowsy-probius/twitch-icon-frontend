import React, { useEffect, useState } from 'react';
import "./App.css";

import { IconMetatdata, IconList, IconWithStats, StreamerData } from './@types';

import Search from "./components/Search";
import SearchResults from './components/SearchList';
import StatsList from "./components/Stats";



function App() {
  const [showStats, setShowStats] = useState<boolean>(false);
  const [data, setData] = useState<IconMetatdata>({});
  const [stats, setStats] = useState<IconWithStats[]>([]);
  const [streamerList, setStreamerList] = useState<string[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchStreamer, setSearchStreamer] = useState<string>("");

  const SearchInputHandler = (searchKey: string, streamer: string) => {
    setSearchKey(searchKey);
    setSearchStreamer(streamer);
  }

  const switchButtonHandler = (/* e: React.MouseEvent */) => {
    setShowStats(!showStats);
  }

  useEffect(() => {
    (async () => {
      const streamersJson = await (await fetch("./list")).json();
      const streamers: string[] = [];
      const newData: IconMetatdata = {};
      const newStats: IconWithStats[] = [];

      const tempData = await Promise.all(streamersJson.map(async (streamerInfo: StreamerData) => {
        const streamerTwitchName = streamerInfo.name.twitch;
        const streamerIcon: IconList = await (await fetch(`./list/${streamerTwitchName}`)).json();
        for(let i=0; i<20; i++)
        {
          const randidx = Math.floor(Math.random() * streamerIcon.icons.length);
          const icon = streamerIcon.icons[randidx];
          newStats.push({
            ...icon,
            stats: Math.floor(Math.random() * 20),
            streamer: streamerTwitchName,
          });
        }

        streamerIcon.icons = streamerIcon.icons.map(i => {
          i.streamer = streamerTwitchName;
          return i;
        });
      
        const ret: any[] = [];
        ret.push(streamerTwitchName);
        ret.push(streamerIcon);
        return ret;
      }));

      tempData.forEach((data: any[]) => {
        streamers.push(data[0] as string);
        newData[data[0] as string] = data[1];
      });

      setStreamerList(streamers);
      setData(newData);
      setStats(newStats);
    })();
  }, []);

  return (
    <div className='App'>
      <button className={`switch-button ${showStats ? 'search' : 'stats'} `} onClick={switchButtonHandler}>
      </button>
      {
        showStats 
        ? 
        <StatsList statistics={stats} />
        :
        <>
          <Search streamers={streamerList} inputHandler={SearchInputHandler}>
            <SearchResults data={data} searchKey={searchKey} streamer={searchStreamer} />
          </Search>      
        </>
      }
    </div>
  );
}

export default App;
