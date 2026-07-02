export const Colors = {
    Black: "#000000",
    Gray: "#616161",
    Red: "#d32f2f",
    Blue: "#1976d2",
    Turquoise: "#0c8b97",
    Green: "#388e3c",
    Orange: "#e36f00ff",
    Purple: "#7b1fa2",
    Pink: "#e91e63",
} as const;
export type Colors = (typeof Colors)[keyof typeof Colors];
