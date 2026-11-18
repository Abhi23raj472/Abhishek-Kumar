import { defineConfig } from 'vite'

// Vercel's sandbox previews run the dev server on *.vercel.run addresses.
const vercelHosts = ['.vercel.run', '.vercel.app']

// base './' keeps asset paths relative, so the site works at
// abhi23raj472.github.io/Abhishek-Kumar/ and at the root of a Vercel domain.
export default defineConfig({
  base: './',
  server: { allowedHosts: vercelHosts },
  preview: { allowedHosts: vercelHosts },
})
