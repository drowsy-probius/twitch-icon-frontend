import React, { useEffect, useState } from 'react';
import "./App.css";

import { IconMetatdata, IconList, Stats, IconStats } from './@types';

import Search from "./components/Search";
import SearchResults from './components/SearchList';
import StatsList from "./components/Stats";



function App() {
  const [showStats, setShowStats] = useState<boolean>(false);
  const [data, setData] = useState<IconMetatdata>({});
  const [streamerList, setStreamerList] = useState<string[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchStreamer, setSearchStreamer] = useState<string>("");
  const [stats, setStats] = useState<IconStats>({});

  const SearchInputHandler = (searchKey: string, streamer: string) => {
    setSearchKey(searchKey);
    setSearchStreamer(streamer);
  }

  const switchButtonHandler = (e: React.MouseEvent) => {
    setShowStats(!showStats);
  }

  useEffect(() => {
    (async () => {
      const streamersJson = await (await fetch("https://twitch-icons.probius.dev/list")).json();
      const streamers: string[] = [];
      const newData: IconMetatdata = {};
      const newStats: IconStats = {};

      const tempData = await Promise.all(streamersJson.map(async (streamerInfo: {name: string, url: string})  => {
        const streamerIcon: IconList = await (await fetch(`https://twitch-icons.probius.dev/list/${streamerInfo.name}`)).json();
        const streamerStats: Stats = {};
        for(let i=0; i<20; i++)
        {
          const randidx = Math.floor(Math.random() * streamerIcon.icons.length);
          const icon = streamerIcon.icons[randidx];
          streamerStats[icon.nameHash] = Math.floor(Math.random() * 20);
        }

        streamerIcon.icons = streamerIcon.icons.map(i => {
          i.streamer = streamerInfo.name;
          return i;
        });
      
        const ret: any[] = [];
        ret.push(streamerInfo.name);
        ret.push(streamerIcon);
        ret.push(streamerStats);
        return ret;
      }));

      tempData.forEach((data: any[]) => {
        streamers.push(data[0] as string);
        newData[data[0] as string] = data[1];
        newStats[data[0] as string] = data[2];
      });

      setStreamerList(streamers);
      setData(newData);
      setStats(newStats);
    })();
  }, []);

  return (
    <div className='App'>
      <div className='switch-button' onClick={switchButtonHandler}>
        Switch!
      </div>
      {
        showStats 
        ? 
        <StatsList data={data} stats={stats}/>
        :
        <>
          <Search streamers={streamerList} inputHandler={SearchInputHandler} />      
          <SearchResults data={data} searchKey={searchKey} streamer={searchStreamer} />
        </>
      }
    </div>
  );
}

export default App;
