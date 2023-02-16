import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import fetch from "node-fetch";

const pokemonSchema = z.object({
  image: z.string(),
  name: z.string()
})

const pokemonAPI = z.object({
  name: z.string(),
  sprites: z.object({
    front_default: z.string()
  })
})

const getAllPokemonsOutput = pokemonSchema.array()

export const pokemonRouter = createTRPCRouter({
  getAllPokemons: publicProcedure
    .output(getAllPokemonsOutput)
    .query(async () => {
      const urls = getPokemonUrls()
      const res = await Promise.all([
        ...urls.map(url => fetch(url).then(response => response.json()))
      ]) as z.infer<typeof pokemonAPI>[]

      return res.map(pokemon => ({
        name: pokemon.name,
        image: pokemon.sprites.front_default
      }))
    })
})

function getPokemonUrls() {
  const pokemonUrls: string[] = []
  for (let i = 1; i <= 150; i++) {
    pokemonUrls.push(`https://pokeapi.co/api/v2/pokemon/${i}`)
  }
  return pokemonUrls
}