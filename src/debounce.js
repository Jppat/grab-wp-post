import { useState, useEffect } from 'react';
import createAxiosInstance from './axiosInstance';

export default function useDebounce(value, delay = 500) {
  const [debouncedData, setDebouncedData] = useState([]);
  
  useEffect(() => {
    if (!value) return;

    const handler = setTimeout(async () => {
      try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.get(
          `https://www.watchmendailyjournal.com/wp-json/wp/v2/categories?slug=${value}&_fields=id,name,slug`
        );
        setDebouncedData(response);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedData;
}