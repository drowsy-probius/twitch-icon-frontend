import React, { useEffect, useState } from 'react';
import "./App.css";

import { Icon, IconMetatdata, IconWithStats } from './@types';

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

  const switchButtonHandler = (e: React.MouseEvent) => {
    setShowStats(!showStats);
  }

  const refreshButtonHandler = async (e: React.MouseEvent) => {
    await chrome.runtime.sendMessage({command: "refresh_all"});
    alert("서버로부터 새 데이터가 있는지 확인합니다. (강제)");
    window.location.reload();
  }

  useEffect(() => {
    (async () => {
      const chromeLocalData = await chrome.storage.local.get();
      const streamerIcon: IconMetatdata = chromeLocalData.iconMetadata;
      const streamerStats: {[streamer: string]: {[hash: string]: number}} = chromeLocalData.iconStats;
      const streamers: string[] = Object.keys(streamerIcon);

      const newData: IconMetatdata = {};
      const newStats: IconWithStats[] = [];
      
      await Promise.all(streamers.map(streamer => {
        for(const nameHash of Object.keys(streamerStats[streamer]))
        {
          const iconList = streamerIcon[streamer].icons.filter((i: Icon) => i.nameHash === nameHash);
          if(iconList.length === 0) continue;
          const icon = iconList[0];
          newStats.push({
            ...icon,
            stats: streamerStats[streamer][nameHash],
            streamer: streamer,
          });
        }

        const icons: Icon[] = streamerIcon[streamer].icons.map((icon: Icon) => {
          return {
            ...icon,
            streamer: streamer
          }
        });
        newData[streamer] = {
          ...streamerIcon[streamer],
          icons: icons
        }
        return;
      }));

      setStreamerList(streamers)
      setData(newData);
      setStats(newStats);
    })();

  }, []);

  return (
    <div className='App'>
      <button className='refresh' onClick={refreshButtonHandler}></button>
      {
        stats.length === 0
        ?
        null
        :
        <button className={`switch-button ${showStats ? 'search' : 'stats'} `} onClick={switchButtonHandler} />
      }
      {
        showStats 
        ? 
        <StatsList statistics={stats} streamers={streamerList}/>
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
