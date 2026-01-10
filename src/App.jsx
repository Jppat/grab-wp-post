import { useState, useEffect } from 'react';

import Form from './Form';
import Posts from './Posts';
import Message from './Message';
import createAxiosInstance from './axiosInstance';
import useDebounceSearch from './debounce';
import Button from './Button';

import './App.css';

function App() {
  const [url, setUrl] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [date, setDate] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchPost, setFetchPost] = useState(false);
  const [message, setMessage] = useState(null);
  const fetchedCategory = useDebounceSearch(category, 2000, url);
  
  useEffect(() => {
    if(!date){
      
      const localDate = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const year = localDate.getFullYear();
      const month = pad(localDate.getMonth() + 1);
      const day = pad(localDate.getDate());
      setDate(`${year}-${month}-${day}`);
    }
  }, [date]);

  useEffect(() => {
    const params = prepareParams();
    async function requestPosts(params){
      const axiosInstance = createAxiosInstance();
      let posts;
      try {
        const response = await axiosInstance.get('/wp-json/wp/v2/posts', {
          baseURL: url,
          params: params
        })
        if (response.data.length === 0) {setMessage("No posts found.")}
        posts = response.data; // return just the data from the API
        setPosts(prevpost => [...prevpost, ...posts]);
        const totalPages = parseInt(response.headers["x-wp-totalpages"], 10);
        setTotalPages(totalPages);
      } catch (error) {
        setMessage(error.humanMessage);
        setPosts([]);
      }
      setIsLoading(false);
    }

    if (fetchPost) {
      requestPosts(params);
      setFetchPost(false);
    }
  },[fetchPost]);

  useEffect(() => {
    const nameToIdObj = Object.fromEntries(fetchedCategory.map(cat => [cat.name.toLowerCase(), cat.id]));
    setCategoryId(nameToIdObj[category])
  }, [category, fetchedCategory]);


  function prepareParams(){
    const params = {}
    category && (params['categories'] = categoryId);
    date && (params['after'] = `${date}T00:00:00`) && (params['before'] = `${date}T23:59:59`);
    page && (params['page'] = page);
    return params;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPosts([]);
    setMessage(null);
    setIsLoading(true);
    setFetchPost(true);
    setPage(1);
  }

  function setNextPage() {
    setIsLoading(true);
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      
      if(nextPage > totalPages){
        setFetchPost(false);
        setIsLoading(false);
        return prevPage
      } else {
        setFetchPost(true);
      }
      
      return nextPage
    });
  }

  return (
    <>
    <main className="flex flex-col justify-center items-center max-w-screen" >
      <Form onSubmit={handleSubmit} 
            url = {url}
            setUrl={setUrl}
            category={category}
            fetchedCategory={fetchedCategory}
            setCategory={setCategory}
            setDate={setDate} />
      <section className="flex flex-col justify-center items-center mb-8" >
        {message && <Message message={message}/>}
        <Posts posts={posts}/>
        {isLoading && <p className="text-center text-lg font-bold text-gray-600 mx-auto m-10">Loading...</p>}
        {((posts.length > 0) && (page != totalPages)) && <Button btnText={"Load More"} type="button" onClick={setNextPage} />}
        {(totalPages !== null && page >= totalPages && !isLoading) && <p className="text-center text-lg font-bold text-gray-600 mx-auto m-10">No more posts to load.</p>}
      </section>
    </main>
    </>
    )
}

export default App


// to do: stop resetting posts in requestPosts but find out why i reset in the first place