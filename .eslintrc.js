module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
    },
    plugins: ["@typescript-eslint/eslint-plugin"],
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended"
    ],
    root: true,
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: [".eslintrc.js"],
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "max-len": ["warn", { code: 250, ignoreComments: true }],
        "prettier/prettier": "off",
        "semi": [2, "always"],
        "indent": ["error", 4],
        "object-curly-spacing":["error", "always"],
        "array-bracket-spacing":["error", "always"],
        "lines-between-class-members": [ "error", "always" ],
        "padding-line-between-statements": ["error",
            { blankLine: "always", prev: "*", next: "return" }],
        "no-multiple-empty-lines": [1, {"max": 1}],

    }
};
