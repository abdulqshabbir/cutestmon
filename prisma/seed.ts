import type { pokemonAPI } from "../src/server/schemas/pokemon"
import type { z } from "zod"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const pokemonUrls = getAllPokemonUrls()
  const pokemonsFromApi = (await Promise.all([
    ...pokemonUrls.map((url) => fetch(url).then((res) => res.json()))
  ])) as z.infer<typeof pokemonAPI>[]

  await prisma.pokemon.createMany({
    data: pokemonsFromApi.map((p) => {
      console.log("id", p.id)
      console.log("name", p.name)
      return {
        id: p.id,
        name: p.name
      }
    })
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })

  .catch(async (e) => {
    console.error(e)

    await prisma.$disconnect()

    process.exit(1)
  })

function getAllPokemonUrls() {
  const urls = []
  for (let i = 1; i <= 150; i++) {
    urls.push(`https://pokeapi.co/api/v2/pokemon/${i}`)
  }
  return urls
}
