import React, {useEffect, useState} from "react";
import Popup from "./components/Popup";
import HighlightsList from "./components/HighlightsList";
import {Content} from "../shared/types/types";

const {electron} = window as any;

const App: React.FC = () => {
    const [savedContent, setSavedContent] = useState<Content[]>([]);

    useEffect(() => {
        electron.invoke("load-data").then((data: Content[]) => {
            setSavedContent(data);
        });
        const onDataSaved = (_event: any, newData: Content) => {
            setSavedContent((prevData) => [...prevData, newData]);
        };
        const removeListener = electron.on("data-saved", onDataSaved);
        return () => {
            removeListener();
        };
    }, []);

    return (
        <div>
            <h1>Your highlights:</h1>
            <div className="container">
                <HighlightsList savedContent={savedContent} />
                <Popup />
            </div>
        </div>
    );
};

export default App;
