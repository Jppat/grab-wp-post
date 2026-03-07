function Button ({onClick, btnText, type="button"}) {
    return (
        <button
            className="btn"
            onClick={onClick}
            type={type}>
            {btnText}
        </button>
    )
}

export default Button;