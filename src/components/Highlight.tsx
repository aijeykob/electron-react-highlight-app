import React from "react";

import {HighlightProps} from "../../shared/types/types";

const Highlight: React.FC<HighlightProps> = ({content}) => {
    return (
        <div className="highlight">
            <div className="txtHeader">
                <p>{content.title}</p>
                <a href={content.url}>{content.url}</a>
            </div>
            <p>{content.text}</p>
        </div>
    );
};

export default Highlight;
