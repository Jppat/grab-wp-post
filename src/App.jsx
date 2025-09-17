import { useState } from 'react'
import DOMPurify from 'dompurify';
import TurndownService from 'turndown';
import Markdown from 'react-markdown'

import createAxiosInstance from './axiosInstance';
import Message from './Message';

import './App.css';

function Post({post}) {

    const [isTextCopied, setIsTextCopied] = useState(false);

    async function copyButton(title, content){
      setIsTextCopied(true);
      const contentByParagraph = content.split(/\n+/);
      const copiedText = `${title}\n${contentByParagraph[0]}`;
      try {
          await navigator.clipboard.writeText(copiedText);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
  }
  return(
    <li key={post.id} className={isTextCopied ? "copiedText" : "noCopy"} >
      <Markdown>{post.title}</Markdown>
      <Markdown>{post.excerpt}</Markdown>
      <button onClick={() => copyButton(post.title, post.content)}>Copy</button>
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
      {(posts.length > 0) && 
      <ul>
        {final_post.map(post => (
          <Post post={post} />
        ))}
      </ul>
    }
    </>
  );
}

function Form(props){
  return(
    <>
      <form onSubmit={props.onSubmit}>
        <div>
          <label htmlFor="url"><strong>WordPress Site URL: </strong></label>
          <input type="url" id= "url" name="url" placeholder="Enter URL of WordPress site here" value={props.url} required onChange={e => {
            let input = e.target;
            if (!input.value.startsWith("http://") && !input.value.startsWith("https://")) {
              input.value = "https://" + input.value;
            }
            props.setUrl(input.value)
          }} />
        </div>

        <div>
          <label htmlFor="category-id"><strong>Category id: </strong></label>
          <input type="number" id= "category-id" name="category-id" min="1" step="1" value={props.categoryId} onChange={e => props.setCategoryId(e.target.value)}/>
        </div>

        <div>
          <label htmlFor="date"><strong>Date published: </strong></label>
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
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault();
    
    const params = {}
    categoryId && (params['categories'] = categoryId);
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
      console.log("inside try block");
    } catch (error) {
      console.log("inside catch block");
      console.log(error);
      setMessage(error.humanMessage);
      setPosts([]);
    }
    setIsLoading(false);
  }

  return (
    <>
    <main>
      <Form className="form" onSubmit={handleSubmit} 
            setUrl={setUrl}
            setCategoryId={setCategoryId}
            setDate={setDate} />
      <section className={"posts"} >
        {isLoading && <p className="loading">Loading...</p>}
        {message && <Message message={message} />}
        <Posts posts={posts}/>
      </section>
    </main>
    </>
    )
}

export default App
