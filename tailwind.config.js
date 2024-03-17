/** @types {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,scss}",
    ],
    darkMode: ["class", '[data-theme="dark"]'],
    theme: {
        extend: {},
    },
    plugins: [
        require("@tailwindcss/typography")
    ],
}

