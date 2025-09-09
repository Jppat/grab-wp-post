import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {

const [url, setUrl] = useState("")
const [categoryId, setCategoryId] = useState(1)
const [date, setDate] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    console.log({url, categoryId, date})
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">WordPress Site URL: </label>
          <input type="url" id= "url" name="url" placeholder="Enter URL of WordPress site here" value={url} onChange={e => setUrl(e.target.value)} />
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
