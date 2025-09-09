import { useState } from 'react'
import axios from "axios";

function App() {

const [url, setUrl] = useState("")
const [categoryId, setCategoryId] = useState(1)
const [date, setDate] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    let params = []

    categoryId && params.push(`categories=${categoryId}`)
    date && params.push(`after=${date}T00:00:00&before=${date}T23:59:59`)

    const request = `${url}/posts?${params && params.join('&')}`
    try {
      const response = await axios.get(request);
      console.log(response.data)
      return response.data; // return just the data from the API
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      return null; // return null (or throw) so the caller knows it failed
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">WordPress Site URL: </label>
          <input type="url" id= "url" name="url" placeholder="Enter URL of WordPress site here" value={url} required onChange={e => setUrl(e.target.value)} />
        </div>

        <div>
          <label htmlFor="category-id">Category id: </label>
          <input type="number" id= "category-id" name="category-id" min="1" step="1" value={categoryId} onChange={e => setCategoryId(e.target.value)}/>
        </div>

        <div>
          <label htmlFor="date">Date published: </label>
          <input type="date" id= "date" name="date"  value={date} onChange={e => setDate(e.target.value)}/>
        </div>

        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default App
