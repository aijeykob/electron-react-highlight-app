import React from "react";
import Highlight from "./Highlight";

import {HighlightsListProps, Content} from "../../shared/types/types";

const HighlightsList: React.FC<HighlightsListProps> = ({savedContent}) => {
    return (
        <div>
            <hr />
            {savedContent.map((content: Content) => (
                <Highlight key={content.url} content={content} />
            ))}
        </div>
    );
};

export default HighlightsList;
