module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Agar tum dusre plugins use karte ho toh wo yaha aa sakte hain
      "react-native-reanimated/plugin", // 👈 ye hamesha LAST me rahe
    ],
  };
};
