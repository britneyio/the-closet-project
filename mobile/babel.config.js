// Expo preset + a `shared` alias so this app imports the same cross-platform
// core (tokens, api, store) that the web app uses, from the repo-root folder.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: { shared: "../shared" },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
    ],
  };
};
