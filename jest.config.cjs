module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  testPathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/node_modules"],
  modulePathIgnorePatterns: [
    "<rootDir>/(build|docs|node_modules|scripts|dist)",
  ],
  moduleNameMapper: {
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "esbuild-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|mdx)$":
      "<rootDir>/config/fileTransformer.js",
  },
  setupFilesAfterEnv: ["<rootDir>/config/jest.js"],
};
