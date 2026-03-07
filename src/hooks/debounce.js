import { useState, useEffect } from 'react';
import createAxiosInstance from '../utils/axiosInstance';

export default function useDebounceSearch(value, delay = 500, url) {
  const [debouncedData, setDebouncedData] = useState([]);
  
  useEffect(() => {
    if (!value || !url) return;

    const handler = setTimeout(async () => {
      try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.get(
          `${url}/wp-json/wp/v2/categories?slug=${value}&_fields=id,name,slug`
        );
        setDebouncedData(response.data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, url]);

  return debouncedData;
}