import { useState, useEffect, useRef } from "react";

import DOMPurify from "dompurify";
import TurndownService from "turndown";
import Markdown from "react-markdown";
import { decode } from "he";

import Button from "../components/Button";

function Post({ post }) {
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(null);
  const [displayedContent, setDisplayedContent] = useState("");
  const [displayIndex, setDisplayIndex] = useState(1);
  const [scheduleDate, setScheduleDate] = useState(null);

  const dialogRef = useRef(null);

  const contentByParagraph = post.content.split(/\n+/);

  function openScheduleDialog() {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }

  function closeScheduleDialog() {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  }

  function handleShowMore() {
    if (displayIndex >= post.content.length) return;
    setDisplayIndex(displayIndex + 1);
  }

  function handleShowLess() {
    if (displayIndex <= 0) return;
    setDisplayIndex(displayIndex - 1);
  }

  useEffect(() => {
    setDisplayedContent(contentByParagraph.slice(0, displayIndex).join("\n\n"));
  }, [displayIndex]);

  async function copyText() {
    const noImages = displayedContent.replace(/!\[[^\]]*]\([^)]*\)/g, "");
    const copiedText = `${post.title}\n\n${noImages}\n\n${post.link}`;
    console.log(copiedText);
    try {
      await navigator.clipboard.writeText(copiedText);
      setIsTextCopied(true);
      setShowCopyMessage("Copied!");
      setTimeout(() => {
        setShowCopyMessage(null);
        setIsTextCopied(false);
      }, 2000);
    } catch (err) {
      setShowCopyMessage("Failed to copy. Try again.");
      console.error("Failed to copy:", err);
    }
  }

  return (
    <>
      <dialog ref={dialogRef} className="modal backdrop-blur-md">
        <div className="p-5 rounded-md bg-white flex flex-col gap-2">
          <div className="gap-0.5">
            <p className="text-sm">Schedule post with title:</p>
            <h2>
              <b>{decode(post.title)}</b>
            </h2>
          </div>
          <label htmlFor="date">
            <strong>Set Date: </strong>
          </label>
          <input
            className="input"
            type="date"
            id="date"
            name="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          />
        </div>

        <Button btnText={"Close"} onClick={closeScheduleDialog} />
      </dialog>

      <li
        className={`max-w-xl card card-border shadow-sm ${isTextCopied ? "bg-primary" : null}`}
      >
        <div className="card-body">
          <a href={post.link} target="blank">
            <h3 className="card-title link link-hover">{decode(post.title)}</h3>
          </a>
          <Markdown>{decode(displayedContent)}</Markdown>
          <div className="card-actions justify-start items-center">
            <Button btnText={"Copy"} onClick={() => copyText()} />
            {showCopyMessage ? (
              <span className="text-xs mx-2 text-accent-content font-bold inline-flex items-center">
                {showCopyMessage}
              </span>
            ) : null}
            <Button btnText={"Show More"} onClick={handleShowMore} />
            <Button btnText={"Show Less"} onClick={handleShowLess} />
            <Button btnText={"Schedule"} onClick={openScheduleDialog} />
          </div>
        </div>
      </li>
    </>
  );
}

function Posts({ posts }) {
  const [orientation, setOrientation] = useState("List");
  const turndownService = new TurndownService();

  let post_info = posts.map((post) => {
    let id = post.id;
    let title = post.title.rendered;
    let excerpt = turndownService.turndown(
      DOMPurify.sanitize(post.excerpt.rendered),
    );
    let content = turndownService.turndown(
      DOMPurify.sanitize(post.content.rendered),
    );
    let link = post.link;
    return { id, title, excerpt, content, link };
  });
  const filtered_post = post_info.filter((post) => post.excerpt != "");
  return (
    <>
      <Button
        onClick={() =>
          setOrientation((prev) => (prev === "List" ? "Grid" : "List"))
        }
        btnText={`Orientation: ${orientation}`}
      />
      {posts.length > 0 && (
        // <ul className = "flex flex-row justify-center flex-wrap gap-5 list-none w-full ps-0">
        <ul
          className={`flex ${orientation === "List" ? "flex-col" : "flex-row items-stretch"} flex-wrap justify-center items-center gap-5 m-5`}
        >
          {filtered_post.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </ul>
      )}
    </>
  );
}

export default Posts;
