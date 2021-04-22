interface Theme {
    background: string;
    gridlines: string;
    primary: string;
    secondary: string;
}

const Themes: { [key: string]: Theme } = {
    default: {
        background: "#A0A0A0",
        gridlines: "#000000",
        primary: "#303030",
        secondary: "#F0F0F0"
    }
};
