/** @types {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,scss}",
    ],
    darkMode: ["class", '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                active: '#0050a5',
                azure: {
                    DEFAULT: "#002f65",
                    900: "#003a7a",
                    850: "#00458f",
                    800: "#0050a5",
                    700: "#005cbb",
                    600: "#0074e9",
                    500: "#438fff",
                    400: "#7cabff",
                    300: "#abc7ff",
                    250: "#d7e3ff",
                    200: "#ecf0ff",
                    150: "#f9f9ff",
                    100: "#fdfbff",
                    50: "#ffffff",
                }
            }
        },
    },
    plugins: [
        require("@tailwindcss/typography")
    ],
}

