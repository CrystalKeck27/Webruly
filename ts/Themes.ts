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
        primary: "#F0F0F0",
        secondary: "#303030"
    }
};