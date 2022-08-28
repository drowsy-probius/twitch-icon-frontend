import React, { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import { ChartData, ChartDataset, Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Range, getTrackBackground } from "react-range";

import { IconWithStats } from "../../@types";
import "./style.css";

interface StatsInterface
{
  streamers: string[],
  statistics: IconWithStats[]
}

ChartJS.register(ArcElement, Tooltip, Legend);

const randomColorNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

function isSameArray(arr1: any[], arr2: any[]): boolean
{
  if(arr1.length !== arr2.length) return false;
  for(let i=0; i<arr1.length; i++)
  {
    if(arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function getValues(stats: IconWithStats[], streamer: string)
{
  return stats
    .filter(icon => (streamer === "" || icon.streamer === streamer))
    .map(icon => icon.stats)
    .sort();
}

function getMinMax(arr: number[])
{
  return [arr[0], arr[arr.length - 1]];
}

function sortStats(stats: IconWithStats[])
{
  stats = stats.filter(icon => icon.stats > 0);
  stats.sort((a, b) => {
    return b.stats - a.stats
  });
  return stats;
}

function createChartData(stats: IconWithStats[], streamer: string, range: number[]): ChartData<"pie">
{
  const chartConfig: ChartData<"pie"> = {
    labels: [],
    datasets: [],
  };
  const dataset: ChartDataset<"pie"> = {
    backgroundColor: [],
    borderColor: [],
    borderWidth: 1,
    data: [],
  };
  const backgroundColors: string[] = [];
  const borderColors: string[] = [];

  const sortedStats = sortStats(stats);
  for(const icon of sortedStats)
  {
    if(icon.stats < range[0]) continue;
    if(icon.stats > range[1]) continue;

    if(streamer !== "" && icon.streamer !== streamer) continue;

    const r = randomColorNum();
    const g = randomColorNum();
    const b = randomColorNum();
    chartConfig.labels?.push(`${icon.streamer}/${icon.keywords[0]}`);
    dataset.data.push(icon.stats);
    backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
    borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
  }
  dataset.backgroundColor = backgroundColors;
  dataset.borderColor = borderColors;
  chartConfig.datasets.push(dataset);

  return chartConfig;
}

function getActiveStreamers(stats: IconWithStats[])
{
  const result: string[] = [];
  for(const stat of stats)
  {
    if(!result.includes(stat.streamer))
    {
      result.push(stat.streamer);
    }
  }
  return result;
}

function StatsList(props: StatsInterface)
{
  const {statistics, streamers} = props;

  const [activeStreamers, setActiveStreamers] = useState<string[]>(getActiveStreamers(statistics));
  const [streamer, setStreamer] = useState("");
  const [statsValues, setStatsValues] = useState<number[]>(getValues(statistics, streamer))
  const [minMax, setMinMax] = useState<number[]>(getMinMax(statsValues));
  const [currentRange, setValues] = useState<number[]>(minMax);
  const [chartData, setChartData] = useState<ChartData<"pie">>(createChartData(statistics, streamer, currentRange));

  const onSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setStreamer(selected);
  }

  useEffect(() => {
    setActiveStreamers(getActiveStreamers(statistics));

  }, [statistics]);

  useEffect(() => {
    const minMax = getMinMax(statsValues);
    setMinMax(minMax);
    setValues(minMax.sort());
  }, [statsValues])

  useEffect(() => {
    setStatsValues(getValues(statistics, streamer))
  }, [streamer, statistics]);

  useEffect(() => {
    setChartData(createChartData(statistics, streamer, currentRange));
  }, [streamer, statistics, currentRange]);

  return (
    <div className="main">
      <div className="header">
        <div className="search-range">
          {
            statsValues.length < 2 || minMax[0] >= minMax[1]
            ?
            null 
            :
            <Range
              values={currentRange}
              step={1}
              min={minMax[0]}
              max={minMax[1]}
              allowOverlap={true}
              onChange={(newValues) => {
                if(isSameArray(currentRange, newValues)) return;
                setValues(newValues);
              }}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    height: '36px',
                    display: 'flex',
                    width: '100%'
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: '5px',
                      width: '100%',
                      borderRadius: '4px',
                      background: getTrackBackground({
                        values: currentRange,
                        colors: ['#ccc', '#548BF4', '#ccc'],
                        min: minMax[0],
                        max: minMax[1],
                        rtl: false
                        }),
                        alignSelf: 'center'
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ index, props, isDragged }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '42px',
                      width: '42px',
                      borderRadius: '4px',
                      backgroundColor: '#FFF',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0px 2px 6px #AAA'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '-28px',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                        padding: '4px',
                        borderRadius: '4px',
                        backgroundColor: '#548BF4'
                      }}
                    >
                      {currentRange[index]}
                    </div>
                    <div
                      style={{
                        height: '16px',
                        width: '5px',
                        backgroundColor: isDragged ? '#548BF4' : '#CCC'
                      }}
                    />
                  </div>
              )}
            />
            }
        </div>

        <div className="search-filter">
          <select name="search-filter-streamer" id="search-filter-streamer" onChange={onSelected}>
            <option value="">전체</option>
            {
              activeStreamers.map((streamer: string) => (
                <option value={streamer} key={streamer}>{streamer}</option>
              ))
            }
          </select>
        </div>
      </div>
      <div className="content stats">
        {
          statsValues.length === 0
          ?
          null 
          :
          <Pie 
            className="stats-canvas" 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }} 
          />
        }
      </div>
    </div>


  )
}

export default StatsList;