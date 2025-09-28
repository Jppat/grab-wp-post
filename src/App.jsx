import { useState, useEffect, useRef, use } from 'react';

import DOMPurify from 'dompurify';
import TurndownService from 'turndown';
import Markdown from 'react-markdown';
import { decode } from "he";

import createAxiosInstance from './axiosInstance';
import Message from './Message';
import Button from './Button';

import './App.css';

function Post({post}) {

    const [isTextCopied, setIsTextCopied] = useState(false);
    const [showCopyMessage, setShowCopyMessage] = useState(null);
    const [displayedContent, setDisplayedContent] = useState("");

    let showMoreCount = useRef(0);

    const contentByParagraph = post.content.split(/\n+/);

    useEffect(() => {
      setDisplayedContent(`${contentByParagraph[0]}`);
    }, []);

    async function copyText(){
      const copiedText = `${post.title}\n${displayedContent}\n\n${post.link}`;
      console.log(copiedText);
      try {
        await navigator.clipboard.writeText(copiedText);
        setIsTextCopied(true);
        setShowCopyMessage('Copied!');
        setTimeout(() => {
          setShowCopyMessage(null);
          setIsTextCopied(false);
        }, 2000);
        } catch (err) {
          setShowCopyMessage('Failed to copy. Try again.');
          console.error('Failed to copy:', err);
        }
      }

    function handleShowMore(){
      showMoreCount.current += 1;
      const content = contentByParagraph.reduce((acc, par, index) => {
        if (index > showMoreCount.current) return acc;
        return acc + "\n\n" + par;
      }, "");
      setDisplayedContent(content);
    }

  return(
    <li className={`card card-border w-3/12 shadow-sm ${isTextCopied ? "bg-primary" : null}`} >
      <div className="card-body grow-0">
        <h3 className='card-title'>{decode(post.title)}</h3>
        <Markdown>{decode(displayedContent)}</Markdown>
        <div className="card-actions justify-start items-center">
          <Button btnText={"Copy"} onClick={() => copyText()} />
          {showCopyMessage ? <span className="text-xs ml-2 text-accent-content font-bold inline-flex items-center">{showCopyMessage}</span>:null}
          <Button btnText={"Show More"} onClick={handleShowMore} />
        </div>
      </div>
    </li>
  )
}

function Posts({posts}) {
  const turndownService = new TurndownService();
  let post_info = posts.map(post => {
    let id = post.id;
    let title = post.title.rendered;
    let excerpt = turndownService.turndown(DOMPurify.sanitize(post.excerpt.rendered));
    let content = turndownService.turndown(DOMPurify.sanitize(post.content.rendered));
    let link = post.link;
    return ({id, title, excerpt, content, link});
  })
  const filtered_post = post_info.filter(post => post.excerpt != "");
  return (
    <>
      {(posts.length > 0) && 
      // <ul className = "flex flex-row justify-center flex-wrap gap-5 list-none w-full ps-0">
      <ul className = "flex flex-row justify-center flex-wrap gap-5 list-none w-full ps-0 p-3">
        {filtered_post.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </ul>
    }
    </>
  );
}

function Form(props){
  return(
    <>
      <form
        className="flex flex-col justify-self-center gap-2 mt-8 mb-8 w-4/12 p-6 rounded-lg shadow-sm" 
        onSubmit={props.onSubmit}>
        <div>
          <label htmlFor="url"><strong>WordPress Site URL: </strong></label>
          <input className="input" type="url" id= "url" name="url" placeholder="Enter URL of WordPress site here" value={props.url} required onChange={e => {
            let input = e.target;
            if (!input.value.startsWith("http://") && !input.value.startsWith("https://")) {
              input.value = "https://" + input.value;
            }
            props.setUrl(input.value)
          }} />
        </div>

        <div>
          <label htmlFor="category"><strong>Category id: </strong></label>
          <input className="input" type="text" id= "category" name="category" value={props.category} onChange={e => props.setCategory(e.target.value)}/>
        </div>

        <div>
          <label htmlFor="date"><strong>Date published: </strong></label>
          <input className="input" type="date" id= "date" name="date"  value={props.date} onChange={e => props.setDate(e.target.value)}/>
        </div>
        <Button btnText={"Submit"} type="submit" />
      </form>
    </>
  )
}

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
    <main className="w-screen" >
      <Form onSubmit={handleSubmit} 
            setUrl={setUrl}
            setCategory={setCategory}
            setDate={setDate} />
      <section className={"posts"} >
        {isLoading && <p className="text-center text-lg font-bold text-gray-600 mx-auto">Loading...</p>}
        {message && <Message message={message} />}
        <Posts posts={posts}/>
      </section>
    </main>
    </>
    )
}

export default App
