import React, { useState } from "react";
import "./style.css"

interface SearchInterface {
  streamers: string[],
  inputHandler: (k: string, s: string) => void;
  children: JSX.Element,
}

function Search(props: SearchInterface)
{
  const [selectedStreamer, setSelectedStreamer] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const {
    streamers,
    inputHandler,
    children
  } = props;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchKey = e.target.value.trim();
    setInput(searchKey)
    inputHandler(searchKey, selectedStreamer);
  }
  
  const onSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const streamer = e.target.value;
    setSelectedStreamer(streamer);
    inputHandler(input, streamer);
  }

  return (
    <div className="main">
      <div className="header">
        <div className="search-bar">
          <input type="text" onChange={onInputChange}/>
        </div>
        <div className="search-filter">
          <select name="search-filter-streamer" id="search-filter-streamer" onChange={onSelected}>
            <option value="">전체</option>
            {
              streamers.map((streamer: string) => (
                <option value={streamer} key={streamer}>{streamer}</option>
              ))
            }
          </select>
        </div>
      </div>
      {children}
    </div>
  )
}

export default Search;