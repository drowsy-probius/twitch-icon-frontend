import React, { useEffect, useState } from "react";

import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from 'react-virtualized-auto-sizer';
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';

import "./style.css"
import { Icon, IconMetatdata } from "../../@types/index";

interface IconListInterface 
{
  data: IconMetatdata, 
  searchKey: string,
  streamer: string,
}


function isArrayIncludesKeyword(arr: string[], keyword: string)
{
  let match = false;
  for(const k of arr)
  {
    if(k.toLowerCase().includes(keyword.toLowerCase()))
    {
      match = true;
      break;
    }
  }
  return match;
}

const IMG_SIZE = 110;
function SearchResults(props: IconListInterface)
{
  const {
    data,
    searchKey,
    streamer
  } = props;

  const [icons, setIcons] = useState<Icon[]>([]);

  function imageOnclickHandler (event: React.MouseEvent){
    const target = event.target as HTMLDivElement;
    if(target === null) return;
    const keywords = target.getAttribute("data-keywords");
    const keyword = keywords?.split(",")[0];
    if(keyword === undefined) return;
    navigator.clipboard.writeText(`~${keyword}`);
  }

  useEffect(() => {
    let result: Icon[] = [];

    if(!data[streamer]) 
    {
      if(searchKey.length === 0)
      {
        Object.keys(data).forEach(streamerName => {
          result = result.concat(data[streamerName].icons);
        });
      }
      else 
      {
        Object.keys(data).forEach(streamerName => {
          data[streamerName].icons.forEach((icon) => {
            if(icon.name.toLowerCase().includes(searchKey.toLowerCase()))
            {
              result.push(icon);
              return;
            }
  
            if(isArrayIncludesKeyword(icon.keywords.concat(icon.tags), searchKey))
            {
              result.push(icon);
              return;
            }
          })
        })
      }
    }
    else 
    {
      if(searchKey.length === 0)
      {
        result = data[streamer].icons;
      }
      else 
      {
        data[streamer].icons.forEach((icon) => {
          if(icon.name.toLowerCase().includes(searchKey.toLowerCase()))
          {
            result.push(icon);
            return;
          }
  
          if(isArrayIncludesKeyword(icon.keywords.concat(icon.tags), searchKey))
          {
            result.push(icon);
            return;
          }
        })
      }
    }

    setIcons(result);
  }, [data, searchKey, streamer]);



  const getColumnLength = (width: number, height: number) => {
    return Math.floor(width / IMG_SIZE);
  }

  const getRowLength = (width: number, height: number) => {
    return Math.ceil(icons.length / Math.floor(width / IMG_SIZE));
  }


  const ImageCell = ({columnIndex, rowIndex, style, data}: {
    columnIndex: number, 
    rowIndex: number, 
    style: React.CSSProperties,
    data: {
      columnLength: number,
      rowLength: number
    }
  }) => 
  {
    if((rowIndex * data.columnLength + columnIndex) >= icons.length) return (<div></div>)
    const icon = icons[rowIndex * data.columnLength + columnIndex];
    return (
      <div className="icon-image" key={`${icon.streamer}/${icon.nameHash}`} onClick={imageOnclickHandler} style={style}>
        <Tippy content={`${icon.streamer}/${icon.keywords}`} placement={"top"} delay={0} theme={"twitch"}>
          <img 
            src={icon.uri} 
            alt={icon.keywords[0]}
            data-keywords={icon.keywords}
            data-tags={icon.tags}
            data-streamer={icon.streamer}
            data-tippy-content={`${icon.streamer}/${icon.keywords}`}
          />
        </Tippy>
      </div>
    )
  }

  return (
    <div className="icon-list">
      <div className="list-container">
        <AutoSizer>
          {
            ({height, width}) => (
              <Grid
                columnCount={getColumnLength(width, height)}
                columnWidth={IMG_SIZE}
                height={height}
                rowCount={getRowLength(width, height)}
                rowHeight={IMG_SIZE}
                width={width}
                style={{overflow: "hidden visible"}}
                itemData={{rowLength: getRowLength(width, height), columnLength: getColumnLength(width, height)}}
              >
                {ImageCell}
              </Grid>
            )
          }
        </AutoSizer>
      </div>
    </div>
  )
}

export default SearchResults;