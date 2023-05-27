// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import "./src/env.mjs"

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/master/sprites/pokemon/**",
        port: ""
      },
      {
        protocol: "https",
        hostname: "sharpest-pokemon.s3.ap-southeast-1.amazonaws.com",
        pathname: "/**.png",
        port: ""
      },
      {
        protocol: "https",
        hostname: "d3h67ipnikmm2c.cloudfront.net",
        pathname: "/**.png",
        port: ""
      }
    ]
  }
}
export default config
