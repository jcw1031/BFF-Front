import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock } from 'lucide-react';

const SearchRankingDisplay = () => {
  const [searchRankings, setSearchRankings] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    fetchSearchRankings();
    updateDateTime();
    const timer = setInterval(updateDateTime, 60000); // 1분마다 업데이트
    return () => clearInterval(timer);
  }, []);

  const fetchSearchRankings = async () => {
    try {
      const response = await fetch('/api/v1/ranking');
      const data = await response.json();
      setSearchRankings(data);
    } catch (error) {
      console.error('Error fetching search rankings:', error);
    }
  };

  const updateDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();

    setCurrentDateTime(`${month}월 ${day}일 ${hour}시 기준`);
  };

  return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold flex items-center">
            <TrendingUp size={20} className="mr-2 text-teal-500" />
            인기 검색어 순위
          </h3>
          <div className="text-xs text-gray-500 flex items-center">
            <Clock size={12} className="mr-1" />
            {currentDateTime}
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2">
          {searchRankings.map((item) => (
              <li key={item.rank} className="flex items-center">
                <span className="mr-2 text-sm font-medium text-teal-500">{item.rank}</span>
                <span className="text-sm">{item.keyword}</span>
              </li>
          ))}
        </ul>
      </div>
  );
};

export default SearchRankingDisplay;
