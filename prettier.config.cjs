/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  trailingComma: "none",
  bracketSameLine: false,
  singleAttributePerLine: true,
  plugins: [require.resolve("prettier-plugin-tailwindcss")]
}
