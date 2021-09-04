import React, {useState,useEffect, useCallback,useMemo} from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { getMoment, findLocation} from './utils/helpers';
import WeatherCard from './Views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './Views/WeatherSetting';


const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const AUTHORIZATION_KEY = "CWB-760A9503-9E21-4058-A384-017C03ED2C76";
  

function App() {
  //頁面切換
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const handleCurrentPageChange = (currentPage)=>{
    setCurrentPage(currentPage);
  };  

  //選擇城市邏輯
  const stroageCity = localStorage.getItem('cityName')||'臺北市';
  const [currentCity, setCurrentCity] = useState(stroageCity);
  const currentLocation = useMemo(
    ()=> findLocation(currentCity),[currentCity,]
  );
  const handleCurrentCityChange = (currentCity)=>{
    setCurrentCity(currentCity);
  };
  const {cityName, locationName, sunriseCityName} = currentLocation;
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  
  //拉資料邏輯
  const [weatherElement, fetchData]=useWeatherAPI(
    {
      locationName,
      cityName,
      authorizationKey: AUTHORIZATION_KEY,
    }
  );

  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(()=>{
      setCurrentTheme(moment === 'day' ? 'light': 'dark');
    },[moment]);
  
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard'&&
        (<WeatherCard 
          cityName = {cityName}
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
          handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage === 'WeatherSetting' && 
          <WeatherSetting
            cityName={cityName}
            handleCurrentCityChange={handleCurrentCityChange}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        }
      </Container>
    </ThemeProvider>
  );
}

export default App;
