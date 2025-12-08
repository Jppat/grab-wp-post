import { useState, useEffect } from 'react';

import Form from './Form';
import Posts from './Posts';
import Message from './Message';
import createAxiosInstance from './axiosInstance';
import useDebounce from './debounce';

import './App.css';

function App() {
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [date, setDate] = useState("")
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)
  
  const fetchedCategory = useDebounce(category, 2000);
  
  useEffect(() => {
    const nameToIdObj = Object.fromEntries(fetchedCategory.map(cat => [cat.name.toLowerCase(), cat.id]));
    setCategoryId(nameToIdObj[category])
  }, [category, fetchedCategory])

  async function handleSubmit(e) {
    e.preventDefault();
    
    const params = {}
    category ? (params['categories'] = categoryId): null;
    date && (params['after'] = `${date}T00:00:00`) && (params['before'] = `${date}T23:59:59`);

    const axiosInstance = createAxiosInstance();
    
    try {
      setMessage(null);
      setIsLoading(true);
      setPosts([]);
      const response = await axiosInstance.get('/wp-json/wp/v2/posts', {
        baseURL: url,
        params: params
      })
      if (response.length === 0) {setMessage("No posts found.")}
      setPosts(response); // return just the data from the API
    } catch (error) {
      setMessage(error.humanMessage);
      setPosts([]);
    }
    setIsLoading(false);
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
      <section className="flex justify-center mb-8" >
        {isLoading && <p className="text-center text-lg font-bold text-gray-600 mx-auto">Loading...</p>}
        {message && <Message message={message} />}
        <Posts posts={posts}/>
      </section>
    </main>
    </>
    )
}

export default App
