function Loading() {
    const style = {
        width: "100%",
        height: "100vh",
        backgroundColor: localStorage.getItem("theme") === "dark" ? "#141517" : "#fff",
    }

    return (
        <>
            <div style={style}>
            </div>
        </>
    )
}

export default Loading;