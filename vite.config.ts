import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "path";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
    manifest_version: 2,
    content_security_policy:
      "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
  };
}

// Détermine si on est en mode production
const isProd = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV);

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
      browser: "firefox",
      webExtConfig: {
        startUrl: ["about:debugging#/runtime/this-firefox", "about:addons"],
        dev: {
          browserConsole: true,
        },
      },
      additionalInputs: ["src/Streams/Streams.html"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        // Exclure les fichiers de dev de la compilation en production uniquement
        ...(isProd ? [/src\/config\/dev\.config\.ts$/] : [])
      ]
    }
  }
});
