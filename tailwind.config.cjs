module.exports = {
    content: [
        "./src/**/*.{html,js,svelte,ts,pcss}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Open Sans", "sans-serif"]
            }
        }
    },
    plugins: [
        require("flowbite/plugin")
    ],
    darkMode: "class"
}
