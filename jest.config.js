const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom", // ✅ switched from "node" → "jsdom"
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"], // ✅ supports React files
  roots: ["<rootDir>/src", "<rootDir>"], // ✅ allows tests both in src/ and project root
};
