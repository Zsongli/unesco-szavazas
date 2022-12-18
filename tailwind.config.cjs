module.exports = {
    content: [
        "./src/**/*.{html,js,svelte,ts,pcss}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
    ],
    theme: {
        extend: {}
    },
    plugins: [
        require("flowbite/plugin")
    ],
    darkMode: "class"
}
