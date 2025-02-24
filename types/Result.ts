export type ComponentResult = {
    title?: string | null;
    description?: string | null;
    image?: string | null;
    type: ComponentResultType | null;
    color?: string | null;
    tags?: string[];
}

export type ComponentResultType = "Quizz" | "Swap" | "Buy"