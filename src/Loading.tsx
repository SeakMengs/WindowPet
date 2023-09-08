function Loading() {
    const style = {
        width: "100%",
        height: "100vh",
        backgroundColor: localStorage.getItem("theme") === "dark" ? "#141517" : "#fff",
    }

    return (
        <>
            {/* <img style={style} src="media/cat-what.gif" alt="loading" /> */}
            <div style={style}>
            </div>
        </>
    )
}

export default Loading;