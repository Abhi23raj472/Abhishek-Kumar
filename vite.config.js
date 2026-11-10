import { defineConfig } from 'vite'

// base './' keeps asset paths relative, so the site works at
// abhi23raj472.github.io/Abhishek-Kumar/ regardless of repo-name casing.
export default defineConfig({
  base: './',
})
