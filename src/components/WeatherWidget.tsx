import { useState, useEffect } from 'react';

interface WeatherWidgetProps {
  darkMode: boolean;
}

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  location: string;
}

const weatherConditions = [
  { condition: 'Sunny', icon: '☀️', tempRange: [22, 32] },
  { condition: 'Partly Cloudy', icon: '⛅', tempRange: [18, 26] },
  { condition: 'Cloudy', icon: '☁️', tempRange: [14, 22] },
  { condition: 'Light Rain', icon: '🌦️', tempRange: [12, 20] },
  { condition: 'Clear', icon: '🌤️', tempRange: [20, 30] },
];

export default function WeatherWidget({ darkMode }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Generate a realistic-looking weather based on time of day
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 20;
    
    // Use a seeded random based on the date so it stays consistent throughout the day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const seed = dayOfYear % weatherConditions.length;
    const weatherType = weatherConditions[seed];
    
    const baseTemp = weatherType.tempRange[0] + Math.random() * (weatherType.tempRange[1] - weatherType.tempRange[0]);
    const temp = Math.round(isDay ? baseTemp : baseTemp - 5);

    setWeather({
      temp,
      condition: weatherType.condition,
      icon: isDay ? weatherType.icon : (weatherType.icon === '☀️' ? '🌙' : weatherType.icon),
      humidity: 40 + Math.round(Math.random() * 40),
      wind: 5 + Math.round(Math.random() * 20),
      location: 'Your Area',
    });
  }, []);

  if (!weather) return null;

  return (
    <div className={`rounded-2xl p-6 h-full transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700'
        : 'bg-white shadow-lg shadow-cyan-100/50 border border-gray-100'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🌡️</span>
        <h3 className={`font-semibold text-sm uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Weather
        </h3>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {weather.temp}°C
          </div>
          <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {weather.condition}
          </div>
          <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            📍 {weather.location}
          </div>
        </div>
        <div className="text-5xl">
          {weather.icon}
        </div>
      </div>

      <div className={`mt-4 pt-4 border-t flex justify-between text-xs ${
        darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'
      }`}>
        <div className="text-center">
          <div className="text-lg mb-0.5">💧</div>
          <div>{weather.humidity}%</div>
          <div className="text-[10px]">Humidity</div>
        </div>
        <div className="text-center">
          <div className="text-lg mb-0.5">💨</div>
          <div>{weather.wind} km/h</div>
          <div className="text-[10px]">Wind</div>
        </div>
        <div className="text-center">
          <div className="text-lg mb-0.5">🌡️</div>
          <div>{weather.temp - 3}° / {weather.temp + 3}°</div>
          <div className="text-[10px]">Low / High</div>
        </div>
      </div>
    </div>
  );
}
