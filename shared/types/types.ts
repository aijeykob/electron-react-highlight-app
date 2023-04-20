export interface Content {
    title: string;
    url: string;
    text: string;
}

export interface HighlightProps {
    content: Content;
}

export interface HighlightsListProps {
    savedContent: Content[];
}
