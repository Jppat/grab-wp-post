import { useState, useEffect } from 'react';

import DOMPurify from 'dompurify';
import TurndownService from 'turndown';
import Markdown from 'react-markdown';
import { decode } from "he";

import Button from './Button';

function Post({post}) {

    const [isTextCopied, setIsTextCopied] = useState(false);
    const [showCopyMessage, setShowCopyMessage] = useState(null);
    const [displayedContent, setDisplayedContent] = useState("");
    const [displayIndex, setDisplayIndex] = useState(0);
    
    const contentByParagraph = post.content.split(/\n+/);

    function handleShowMore() {
      if (displayIndex >= post.content.length) return;
      setDisplayIndex(displayIndex + 1);
    }

    function handleShowLess() {
        if (displayIndex <= 0) return;
        setDisplayIndex(displayIndex - 1);
    }

    useEffect(() => {
      setDisplayedContent(contentByParagraph.slice(0, displayIndex).join('\n\n'));
    }, [displayIndex]);

    async function copyText(){
      const copiedText = `${post.title}\n\n${displayedContent}\n\n${post.link}`;
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

  return(
    <li className={`card card-border shadow-sm ${isTextCopied ? "bg-primary" : null}`} >
      <div className="card-body">
        <h3 className='card-title'>{decode(post.title)}</h3>
        <Markdown>{decode(displayedContent)}</Markdown>
        <div className="card-actions justify-start items-center">
          <Button btnText={"Copy"} onClick={() => copyText()} />
          {showCopyMessage ? <span className="text-xs mx-2 text-accent-content font-bold inline-flex items-center">{showCopyMessage}</span>:null}
          <Button btnText={"Show More"} onClick={handleShowMore} />
          <Button btnText={"Show Less"} onClick={handleShowLess} />
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
      <ul className = "flex flex-col gap-5 min-w-[300px] max-w-2/5">
        {filtered_post.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </ul>
    }
    </>
  );
}

export default Posts;