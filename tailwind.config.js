/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,js,ts,jsx,tsx}"];
export const theme = {
    extend: {
        container: {
            center: true
        },
        colors: {
            "csk-2d5356500": "var(--csk-2d5356500)",
            gold: "var(--gold)",
        },
    },
};
export const plugins = [];
