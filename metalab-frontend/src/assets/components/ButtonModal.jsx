import React from 'react'

const ButtonModal = (props) => {
    const text = props.text;
    const styleCss = props.styleCss;
    console.log(styleCss);
    return (
        <>
            <button type="button" className={`${styleCss}`} data-bs-toggle="modal" data-bs-target="#exampleModal">
                {text}
            </button>
        </>
    )
}

export default ButtonModal