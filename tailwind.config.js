module.exports = {
  content: [
    "./client/**/*.{html,js,jsx}", // Apply to all files under /client
    "./imports/**/*.{html,js,jsx}", // Apply to all files under /imports
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};
