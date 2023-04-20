import React, {useCallback, useState} from "react";

const {electron} = window as any;

const Popup: React.FC = () => {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        setError("");
    }, []);

    const handleLoadURL = useCallback(() => {
        try {
            new URL(url);
        } catch (error) {
            setError("Invalid URL format");
            return;
        }
        electron.invoke("create-browser-view", url);
    }, [url]);

    return (
        <div className="secondContainer">
            <div>
                <input type="text" placeholder="Enter URL" value={url} onChange={handleUrlChange} />
                <button onClick={handleLoadURL}>Go</button>
                {error && <div className="colorRed">{error}</div>}
            </div>
        </div>
    );
};

export default Popup;
