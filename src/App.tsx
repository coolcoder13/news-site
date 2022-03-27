import { useCallback, useEffect, useState } from 'react';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import AirOutlinedIcon from '@mui/icons-material/AirOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

interface HeadLineResponse {
  articles: any[]
  status: string
  totalResults: number
}

interface DetailedWeather {
  dt: number
  humidity: number
  weather: {
    description: string
    icon: string
  }[]
}

interface WeatherResponse {
  current: DetailedWeather & { temp: number }
  daily: (DetailedWeather & { temp: { day: number } })[]
}

const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const weekday = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

function App() {

  const [headLinesData, setHeadLinesData] = useState<HeadLineResponse | any>()
  const [weatherData, setWeatherData] = useState<WeatherResponse>()

  useEffect(() => {
    fetch('https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=7d2ec379b89d46cc9f71d1f3cf8b9bb5').then(
      (res) => res.json()
    ).then((res) => {
      console.log(res)
      setHeadLinesData(res)
    })

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=20.5937&lon=78.9629&exclude=minutely,hourly&appid=620ca0f7265f47adfbbb336ee139c430').then(
      (res) => res.json()).then((res) => {
        console.log(res)
        setWeatherData(res)
      })
  }, [])

  function timeDifference(publishAt: Date) {
    let diffInMilliSeconds = Math.abs((new Date().getTime()) - (new Date(publishAt).getTime())) / 1000;

    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    if (days > 0) return `${days} days`

    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    return `${hours} hours`
  }

  function weatherIcon(icon: string) {
    if (icon.includes('01')) return <WbSunnyOutlinedIcon />
    else if (icon.includes('02') ||
      icon.includes('03') ||
      icon.includes('04') ||
      icon.includes('09') ||
      icon.includes('10') ||
      icon.includes('11')) return <CloudOutlinedIcon />
    else if (icon.includes('13')) return <AcUnitOutlinedIcon />
    else if (icon.includes('50')) return <AirOutlinedIcon />
  }

  function weatherSmallScreen(date: number, temp: number, icon: string) {
    return (
      <div className='flex flex-col items-center flex-1 md:flex-row md:justify-between'>
        <b className='md:hidden'>{weekdayShort[new Date(date * 1000).getDay()]}</b>
        <b className='hidden md:block md:w-2/4'>{weekday[new Date(date * 1000).getDay()]}</b>
        <span className='md:w-1/4 md:text-right'>{weatherIcon(icon)}</span>
        <span className='md:w-1/4 md:text-right'>{Math.round(temp - 273.15)}</span>
      </div>
    )
  }

  const weatherList = useCallback(
    () => {
      if (weatherData) {
        const weatherList = [weatherSmallScreen(
          weatherData?.current.dt as number,
          weatherData?.current.temp as number,
          weatherData?.current.weather[0].icon as string
        )]
        weatherData?.daily.slice(0, 4).map((item) => {
          weatherList.push(weatherSmallScreen(item.dt, item.temp.day, item.weather[0].icon))
        })
        return weatherList.map(item => <div className='flex'>{item}</div>)
      }
      return null
    },
    [weatherData],
  )


  return (
    <div className="App">
      <header className='flex justify-between px-8 py-4 md:px-16'>
        <div className='flex p-1 font-bold'>
          <p className='mr-2 text-white bg-black rounded-md '>News</p>
          <>Portal</></div>
        <div>
          <SearchOutlinedIcon className='mr-8' />
          <LogoutOutlinedIcon />
        </div>
      </header>
      <main className="p-8 space-y-3 md:px-16 md:py-8">
        <div className='flex justify-between md:hidden'>
          {weatherList()}
        </div>
        <div className='md:flex'>
          <div className='w-full md:w-2/3'>
            <p className='text-4xl font-bold'>Hot Topics</p>
            {headLinesData?.articles?.splice(0, 1).map((item: any) => {
              return (
                <div className="flex flex-col-reverse flex-1">
                  <div className="relative bg-center bg-cover rounded-lg h-72" style={{ backgroundImage: `url(${item.urlToImage})` }}></div>
                  <span className='absolute w-8/12 p-4 text-white md:w-1/2'>
                    <div className="flex-1 mb-4 text-xs font-bold md:text-base">
                      <p>{item.title}</p>
                    </div>
                    <div className='pt-1 text-xs'>{timeDifference(item.publishedAt)}</div>
                  </span>
                </div>
              )
            })}
          </div>
          <span className='hidden md:block md:w-1/3 md:p-4'>
            <div>{weatherList()}</div>
          </span>
        </div>
        <>
          <p className='text-xl font-bold'>Latest News</p>
          <div className='grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3 lg:grid-cols-4'>
            {headLinesData?.articles?.slice(1).map((item: any) => {
              return (
                <div className="flex flex-col flex-1">
                  <div className="h-40 bg-center bg-cover rounded-lg" style={{ backgroundImage: `url(${item.urlToImage})` }}></div>
                  <div className="flex-1 mb-4 text-sm font-bold">
                    <p>{item.title}</p>
                  </div>
                  <div className='pt-1'>{timeDifference(item.publishedAt)}</div>
                </div>
              )
            })}
          </div>
        </>
      </main>
    </div>
  );
}

export default App;
