function Navbar({setHighlightFaq}) {

    return (
        <>
            <div className="navbar bg-base-100 shadow-lg w-5/12 rounded-full">
            <div className="flex-1">
                <a className="site-title rounded-full btn btn-ghost text-xl font-bold">Grab WP Post</a>
                <a className="site-title-small rounded-full btn btn-ghost text-xl font-bold">GWP</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                {/* <li><a href="#faq">FAQ</a></li> */}
                <button 
                    className="rounded-full btn btn-ghost btn-sm ml-4" 
                    onClick={() => {
                        setHighlightFaq(true);
                        document.getElementById('faq').scrollIntoView({ behavior: 'smooth' });
                }}
                >FAQ
                </button>
                </ul>
            </div>
            </div>
        </>
    )
}


export default Navbar;