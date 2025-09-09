import { useState } from 'react'
import axios from "axios";

function Posts({posts}) {
  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title.rendered}</li>
        ))}
      </ul>
    </div>
  );
}

function Form(props){
  return(
    <>
      <form onSubmit={props.onSubmit}>
        <div>
          <label htmlFor="url">WordPress Site URL: </label>
          <input type="url" id= "url" name="url" placeholder="Enter URL of WordPress site here" value={props.url} required onChange={e => props.setUrl(e.target.value)} />
        </div>

        <div>
          <label htmlFor="category-id">Category id: </label>
          <input type="number" id= "category-id" name="category-id" min="1" step="1" value={props.categoryId} onChange={e => props.setCategoryId(e.target.value)}/>
        </div>

        <div>
          <label htmlFor="date">Date published: </label>
          <input type="date" id= "date" name="date"  value={props.date} onChange={e => props.setDate(e.target.value)}/>
        </div>

        <button type="submit">Submit</button>
      </form>
    </>
  )
}

function App() {
  const [url, setUrl] = useState("")
  const [categoryId, setCategoryId] = useState(1)
  const [date, setDate] = useState("")
  const [posts, setPosts] = useState([])

  async function handleSubmit(e) {
    e.preventDefault()
    let params = []

    categoryId && params.push(`categories=${categoryId}`)
    date && params.push(`after=${date}T00:00:00&before=${date}T23:59:59`)

    const request = `${url}/posts?${params && params.join('&')}`
    try {
      const response = await axios.get(request);
      setPosts(response.data); // return just the data from the API
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setPosts([])
    }
  }

  return (
    <>
      <Form onSubmit={handleSubmit} 
            setUrl={setUrl}
            setCategoryId={setCategoryId}
            setDate={setDate}
      />
      <Posts posts={posts}/>
    </>
    )
}

export default App
