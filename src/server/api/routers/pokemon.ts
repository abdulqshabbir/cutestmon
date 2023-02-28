import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { type pokemonAPI } from "../../schemas/pokemon"
import fetch from "node-fetch"
import * as _ from "lodash"

const pokemonSchema = z.object({
  image: z.string(),
  name: z.string()
})

const getAllPokemonsOutput = pokemonSchema.array()
const getTwoRandomPokemons = pokemonSchema.array()

export const pokemonRouter = createTRPCRouter({
  getAllPokemons: publicProcedure
    .output(getAllPokemonsOutput)
    .query(async () => {
      const urls = getPokemonUrls()
      const res = (await Promise.all([
        ...urls.map((url) => fetch(url).then((response) => response.json()))
      ])) as z.infer<typeof pokemonAPI>[]

      return res.map((pokemon) => ({
        name: pokemon?.name,
        image: pokemon.sprites.other?.["official-artwork"]?.front_default
      }))
    }),
  getTwoRandomPokemons: publicProcedure
    .output(getTwoRandomPokemons)
    .query(async () => {
      const urls = getTwoRandomPokemonUrls()
      const res = (await Promise.all([
        ...urls.map((url) => fetch(url).then((res) => res.json()))
      ])) as z.infer<typeof pokemonAPI>[]

      return res.map((pokemon) => ({
        name: pokemon?.name,
        image: pokemon.sprites.other?.["official-artwork"]?.front_default
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

function getTwoRandomPokemonUrls() {
  const pokemonUrls: string[] = []
  const firstRandomInt = _.random(1, 150)
  const secondRandomInt = _.random(1, 150)
  pokemonUrls.push(`https://pokeapi.co/api/v2/pokemon/${firstRandomInt}`)
  pokemonUrls.push(`https://pokeapi.co/api/v2/pokemon/${secondRandomInt}`)
  return pokemonUrls
}
