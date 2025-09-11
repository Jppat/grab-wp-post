import { useState } from 'react'
import axios from "axios";
import DOMPurify from 'dompurify';
import TurndownService from 'turndown';
import Markdown from 'react-markdown'
import './App.css';

function Post({post}) {

    const [isTextCopied, setIsTextCopied] = useState(false);

    async function copyButton(title, content){
      setIsTextCopied(true);
      const contentByParagraph = content.split(/\n+/);
      const copiedText = `${title}\n${contentByParagraph[0]}`;
      try {
          await navigator.clipboard.writeText(copiedText);
          console.log('Copied to clipboard:', copiedText);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
  }
  return(
    <li key={post.id} className={isTextCopied && "copiedText"} >
      <Markdown>{post.title}</Markdown>
      <Markdown>{post.excerpt}</Markdown>
      <button onClick={() => copyButton(post.title, post.content)}>Copy</button>
      {console.log(isTextCopied)}
    </li>
  )
}

function Posts({posts}) {
  const turndownService = new TurndownService();
  let post_info = posts.map(post => {
    let id = post.id;
    let title = turndownService.turndown(`<h3>${DOMPurify.sanitize(post.title.rendered)}</h3>`);
    let excerpt = turndownService.turndown(DOMPurify.sanitize(post.excerpt.rendered));
    let content = turndownService.turndown(DOMPurify.sanitize(post.content.rendered));
    return ({id, title, excerpt, content});
  })
  const final_post = post_info.filter(post => post.excerpt != "");
  return (
    <>
      {(final_post.length != 0) && <h2>Posts</h2>}
      <ul>
        {final_post.map(post => (
          <Post post={post} />
        ))}
      </ul>
    </>
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
    e.preventDefault();
    let params = [];

    categoryId && params.push(`categories=${categoryId}`);
    date && params.push(`after=${date}T00:00:00&before=${date}T23:59:59`);

    const request = `${url}/posts?${params && params.join('&')}`;
    try {
      const response = await axios.get(request);
      setPosts(response.data); // return just the data from the API
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setPosts([]);
    }
  }

  return (
    <>
    <main>
      <Form className="form" onSubmit={handleSubmit} 
            setUrl={setUrl}
            setCategoryId={setCategoryId}
            setDate={setDate} />
      <Posts posts={posts}/>
    </main>
    </>
    )
}

export default App
