import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ChevronLeft, MapPin, Search, ShoppingCart, Star} from 'lucide-react';
import LocationModal from './LocationModal';
import RegisterRestaurant from './RegisterRestaurant';
import SearchRanking from './SearchRanking';
import SearchRankingDisplay from './SearchRankingDisplay'

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState('배달 99+');
  const [pageNumber, setPageNumber] = useState(0);
  const [keyword, setKeyword] = useState('치킨');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState('서울특별시 송파구 방이동');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const observer = useRef();

  const lastRestaurantElementRef = useCallback(node => {
    if (isLoading) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore]);

  const fetchData = useCallback(async (page, searchKeyword) => {
    setIsLoading(true);
    try {
      const formattedDeliveryLocation = deliveryLocation.replace(/\s+/g, '_');
      console.log(searchKeyword + " " + formattedDeliveryLocation);
      const response = await fetch(
          `/api/v1/restaurant-summary/cache?keyword=${searchKeyword}&deliveryLocation=${formattedDeliveryLocation}&pageNumber=${page}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.response)) {
        if (page === 0) {
          setRestaurants(data.response);
        } else {
          setRestaurants(prev => [...prev, ...data.response]);
        }
        setHasMore(data.response.length > 0);
      } else {
        console.error('Invalid data format:', data);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setHasMore(false);
    }
    setIsLoading(false);
  }, [deliveryLocation]);

  const handleSearch = useCallback((e) => {
    if (e) e.preventDefault();
    setPageNumber(0);
    setRestaurants([]);
    setHasMore(true);
    fetchData(0, keyword);
  }, [keyword, fetchData]);

  const handleKeywordChange = useCallback((newKeyword) => {
    setKeyword(newKeyword);
  }, []);

  const handleSelectKeyword = useCallback((selectedKeyword) => {
    setKeyword(selectedKeyword);
    handleSearch();
  }, [handleSearch]);

  const handleLocationChange = (newLocation) => {
    setDeliveryLocation(newLocation);
    setPageNumber(0);
    setRestaurants([]);
    setHasMore(true);
    fetchData(0, keyword);
  };

  useEffect(() => {
    console.log('Current keyword:', keyword); // 디버깅을 위한 로그
  }, [keyword]);


  const tabs = ['전체', '인기 검색어', '배달', '가게 등록'];

  return (
      <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
        <div className="sticky top-0 bg-white z-10">
          <div className="flex items-center p-4 border-b">
            <button className="mr-4">
              <ChevronLeft size={24}/>
            </button>
            <div className="flex-grow relative">
              <form onSubmit={handleSearch} className="relative">
                <SearchRanking
                    onSelectKeyword={handleSelectKeyword}
                    onKeywordChange={handleKeywordChange}
                    keyword={keyword}
                />
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
              </form>
            </div>
            <button className="ml-4">
              <ShoppingCart size={24}/>
            </button>
          </div>

          <button
              onClick={() => setIsLocationModalOpen(true)}
              className="w-full py-3 px-4 bg-white border-b flex items-center justify-between
          hover:outline-none hover:ring-teal-500 hover:border-teal-500
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <div className="flex items-center">
              <MapPin className="mr-2" size={20}/>
              <span className="font-medium">{deliveryLocation}</span>
            </div>
            <ChevronLeft className="transform rotate-180" size={20}/>
          </button>

          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`flex-shrink-0 py-3 px-4 text-sm 
              hover:outline-none hover:ring-teal-500 hover:border-teal-500
              focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
                        activeTab === tab
                            ? 'border-b-2 border-teal-400 font-bold' : ''
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      if (tab === '가게 등록') {
                        setIsRegisterModalOpen(true);
                      }
                    }}
                >
                  {tab}
                </button>
            ))}
          </div>

          <div className="p-4 bg-white border-b">
            <p className="text-sm font-bold">
              기본순 <span className="text-xs text-gray-500">ⓘ</span>
            </p>
          </div>
        </div>

        <div className="p-4">
          {restaurants.map((restaurant, index) => (
              <div
                  key={restaurant.restaurantUuid}
                  ref={index === restaurants.length - 1
                      ? lastRestaurantElementRef : null}
                  className="bg-white rounded-lg p-4 mb-4 shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <h3 className="font-semibold text-base">{restaurant.restaurantName}</h3>
                      {restaurant.hasAdvertisement && (
                          <span
                              className="ml-2 text-xs font-medium text-gray-500 border border-gray-500 rounded px-1">광고</span>
                      )}
                    </div>
                    <div className="flex items-center mb-1">
                      <Star className="h-4 w-4 text-yellow-400 mr-1"/>
                      <span className="text-sm font-medium">
              {restaurant.rating.toFixed(1)}
            </span>
                      <span className="text-xs text-gray-500 ml-1">
              리뷰 {restaurant.reviewCount}
            </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {restaurant.min > 0
                          ? `${restaurant.min}-${restaurant.max}분` : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      최소주문 {restaurant.minimumOrderAmount.toLocaleString()}원
                    </p>
                  </div>
                  <div
                      className="w-20 h-20 bg-gray-200 rounded-lg ml-4 flex-shrink-0"></div>
                </div>
                {restaurant.hasCoupon && (
                    <div
                        className="mt-2 inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                      {restaurant.couponName}
                    </div>
                )}
              </div>
          ))}

          {isLoading && <p className="text-center py-4">로딩 중...</p>}
          {!isLoading && !hasMore && (
              <>
                <SearchRankingDisplay />
                <p className="text-center py-4">더 이상 표시할 식당이 없습니다.</p>
              </>
          )}
        </div>

        <div
            className="sticky bottom-0 bg-teal-400 text-white p-4 rounded-t-lg text-center">
          <p className="font-bold">배민 클럽으로 무료 배달</p>
          <p className="text-sm">지금 가입하세요!! ~~</p>
        </div>

        <LocationModal
            isOpen={isLocationModalOpen}
            onClose={() => setIsLocationModalOpen(false)}
            onSelectLocation={handleLocationChange}
            currentLocation={deliveryLocation}
        />

        <RegisterRestaurant
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
        />
      </div>
  );
};

export default RestaurantList;
