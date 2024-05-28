/** @types {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,scss}",
    ],
    darkMode: ["class", '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                active: '#516dd1'
            }
        },
    },
    plugins: [
        require("@tailwindcss/typography")
    ],
}

