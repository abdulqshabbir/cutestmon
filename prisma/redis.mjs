/* eslint-disable @typescript-eslint/no-var-requires */
import { Redis } from "@upstash/redis"
import axios from "axios"
import "isomorphic-fetch"

const redis = new Redis({
  url: "https://joint-mammoth-34980.upstash.io",
  token:
    "AYikACQgNjFiN2YyMGItM2RjYi00MWEzLTg5M2EtYjUzZGM5NTM2ZmNmZDVlZmI5ZjNkMDRjNGQ0M2IxMmZkYWZiOTllNzFiYzA="
})

async function main() {
  const pokemonUrls = getAllPokemonUrls()
  const pokemonsFromApi = await Promise.all([
    ...pokemonUrls.map((url) =>
      axios(url, { responseType: "json" }).then((res) => {
        return res.data
      })
    )
  ])

  async function convertImageToBlob(url, id) {
    const res = await axios(url, { responseType: "arraybuffer" })
    const buffer = res.data
    const blob = Buffer.from(buffer).toString("base64")
    return {
      id,
      blob
    }
  }

  const pokemonBlobs = await Promise.all(
    pokemonsFromApi.map((p) =>
      convertImageToBlob(
        p.sprites.other["official-artwork"].front_default,
        String(p.id)
      )
    )
  )

  console.log("pokemon blobs", pokemonBlobs)

  await Promise.all(pokemonBlobs.map((p) => redis.set(p.id, p.blob))).catch(
    (e) => console.error(e)
  )
}

main()
  .then(() => {
    console.log("successfully stored pokemon blobs to redis")
  })
  .catch((e) => {
    console.log("error pushing to redis")
    console.error(e.message)
  })

function getAllPokemonUrls() {
  const urls = []
  for (let i = 1; i <= 150; i++) {
    urls.push(`https://pokeapi.co/api/v2/pokemon/${i}`)
  }
  return urls
}
