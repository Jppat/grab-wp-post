import { useState, useEffect, useRef } from 'react';

import DOMPurify from 'dompurify';
import TurndownService from 'turndown';
import Markdown from 'react-markdown';
import { decode } from "he";

import Button from './Button';

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

export default Posts;