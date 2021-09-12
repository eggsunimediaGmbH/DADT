module.exports = {
  pages: {
    devtools: {
      template: "public/browser-extension.html",
      entry: "./src/devtools/main.js",
      title: "Devtools",
    },
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: "src/background.js",
        },
        contentScripts: {
          entries: {
            communicator: "src/content-script.js",
          },
        },
      },
      manifestTransformer: (manifest) => {
        // add Vue debugger exception 
        if (process.env.NODE_ENV === "development") {
          manifest.content_security_policy =
            "script-src 'self' 'unsafe-eval' http://localhost:8098; object-src 'self'";
        }
        return manifest;
      },
    },
  },
};
