import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { type pokemonAPI } from "../../schemas/pokemon"
import fetch from "node-fetch"
import * as _ from "lodash"
import { prisma } from "../../db"

const pokemonSchema = z.object({
  image: z.string(),
  name: z.string(),
  id: z.number()
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
        image: pokemon?.sprites?.other?.["official-artwork"]?.front_default,
        id: pokemon?.id
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
        image: pokemon.sprites.other?.["official-artwork"]?.front_default,
        id: pokemon.id
      }))
    }),
  voteForPokemonById: publicProcedure
    .input(pokemonSchema)
    .output(pokemonSchema)
    .mutation(async (req) => {
      const { id, image, name } = req.input
      if (id < 1 || id > 150)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pokemon ids must be between 1 - 150"
        })

      const pokemon = await prisma.pokemon.findUnique({
        where: {
          id: id
        }
      })

      if (!pokemon) {
        return await prisma.pokemon.create({
          data: {
            id,
            image,
            name,
            votes: 1
          }
        })
      } else {
        return await prisma.pokemon.update({
          where: { id },
          data: { votes: { increment: 1 } }
        })
      }
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
  let firstRandomInt = _.random(1, 150)
  const secondRandomInt = _.random(1, 150)

  while (firstRandomInt === secondRandomInt) {
    firstRandomInt = _.random(1, 150)
  }
  pokemonUrls.push(`https://pokeapi.co/api/v2/pokemon/${firstRandomInt}`)
  pokemonUrls.push(`https://pokeapi.co/api/v2/pokemon/${secondRandomInt}`)
  return pokemonUrls
}
