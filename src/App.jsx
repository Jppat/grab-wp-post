import { useState } from 'react';

import createAxiosInstance from './axiosInstance';
import Message from './Message';
import Form from './Form';
import Posts from './Posts';

import './App.css';

function App() {
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState(null)
  const [date, setDate] = useState("")
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault();
    
    const params = {}
    category ? (params['categories'] = category): null;
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
            setUrl={setUrl}
            setCategory={setCategory}
            setDate={setDate} />
      <section className="flex justify-center" >
        {isLoading && <p className="text-center text-lg font-bold text-gray-600 mx-auto">Loading...</p>}
        {message && <Message message={message} />}
        <Posts posts={posts}/>
      </section>
    </main>
    </>
    )
}

export default App
