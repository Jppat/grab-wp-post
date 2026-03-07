function Faq({highlightFaq}) {

    return (
        <>
            <h2 id="faq" className={`text-2xl font-bold mb-4 p-1.5 ${highlightFaq ? 'bg-amber-100' : ''}`}>Frequently Asked Questions (FAQ)</h2>
            <div className="collapse bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-1" defaultChecked />
            <div className="collapse-title font-semibold">What is Grab WP Post?</div>
            <div className="collapse-content text-sm">Grab WP Post is a personal tool I built to help me easily 'grab' WordPress posts. It allows me to skip
                manual copy + pasting whenever I want to reuse or share content. It's currently tailored to my own workflow; it's not really 
                designed for general use at the moment but I decided to share it online in case anyone might find it useful. Rest assured, I plan to add more
                features outside of my own needs soon.
            </div>
            </div>
            <div className="collapse bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title font-semibold">How do I use it?</div>
            <div className="collapse-content text-sm">Simply type in the URL of your WordPress website. Enter a category, then date or leave them blank. An empty
                category means you want to get all posts, while the date defaults to the current day.
            </div>
            </div>
        </>
    )
}

export default Faq;