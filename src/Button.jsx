function Button ({onClick, btnText, type="button"}) {
    return (
        <button
            className="btn max-w-3/6"
            onClick={onClick}
            type={type}>
            {btnText}
        </button>
    )
}

export default Button;