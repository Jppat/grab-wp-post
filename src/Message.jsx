import { useState } from "react";

function Message ({message}) {
    return (
        <>
            <p className="error">{message}</p>
        </>
    )
}

export default Message;