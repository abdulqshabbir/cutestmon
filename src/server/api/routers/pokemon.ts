import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import * as _ from "lodash"
import { prisma } from "../../db"
import { Redis } from "@upstash/redis"
import { env } from "../../../env.mjs"

const voteByIdInput = z.object({
  id: z.number(),
  idVotedAgainst: z.number()
})

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN
})

export const pokemonRouter = createTRPCRouter({
  all: publicProcedure.query(async () => {
    const pokemons = await prisma.pokemon.findMany({
      orderBy: [
        {
          ranking: "desc"
        }
      ]
    })
    return pokemons
  }),
  allInfinite: publicProcedure
    .input(
      z.object({
        take: z.number().min(1).max(150).nullish(),
        cursor: z.number().nullish()
      })
    )
    .query(async ({ input }) => {
      const limit = input?.take ?? 30
      const pokemons = await prisma.pokemon.findMany({
        take: limit + 1,
        orderBy: [
          {
            ranking: "desc"
          }
        ],
        // use id of pokemon as our cursor
        cursor: input?.cursor ? { id: input.cursor } : undefined
      })

      let nextCursor = undefined
      if (pokemons.length > limit) {
        const nextPokemonCursor = pokemons.pop()
        nextCursor = nextPokemonCursor?.id
      }

      return {
        pokemons,
        nextCursor
      }
    }),

  twoRandom: publicProcedure.query(async () => {
    const [idFirst, idSecond] = getTwoRandomPokemonIds()

    const pokemon = await prisma.pokemon.findMany({
      where: {
        OR: [
          {
            id: idFirst
          },
          {
            id: idSecond
          }
        ]
      }
    })

    const blob1 = await redis.get(String(idFirst))
    const blob2 = await redis.get(String(idSecond))

    const pokemonWithBlobs = pokemon.map((p) => {
      if (p.id === idFirst) {
        return {
          ...p,
          blob: blob1
        }
      } else if (p.id === idSecond) {
        return {
          ...p,
          blob: blob2
        }
      }
    })

    return pokemonWithBlobs
  }),

  voteById: publicProcedure.input(voteByIdInput).mutation(async (req) => {
    const { id, idVotedAgainst } = req.input

    if (id < 1 || id > 150)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Pokemon ids must be between 1 - 150"
      })

    const votedForPokemon = await prisma.pokemon.findUnique({
      where: {
        id: id
      }
    })

    const votedAgainstPokemon = await prisma.pokemon.findUnique({
      where: {
        id: idVotedAgainst
      }
    })

    if (!votedForPokemon) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "We could not find the pokemon you voted for in the db :("
      })
    }

    if (!votedAgainstPokemon) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "We could not find the pokemon you voted against in the db :("
      })
    }
    const ratingA = votedForPokemon.ranking
    const ratingB = votedAgainstPokemon.ranking

    const { ratingA: newRatingA, ratingB: newRatingB } = eloRating(
      ratingA,
      ratingB,
      30
    )

    await prisma.pokemon.update({
      where: { id: id },
      data: {
        ranking: {
          set: newRatingA
        }
      }
    })

    await prisma.pokemon.update({
      where: { id: idVotedAgainst },
      data: {
        ranking: {
          set: newRatingB
        }
      }
    })

    return votedForPokemon
  }),

  topThree: publicProcedure.query(async () => {
    return await prisma.pokemon.findMany({
      orderBy: {
        ranking: "desc"
      },
      take: 3
    })
  })
})

function expectedProbabilityOfWinning(ratingA: number, ratingB: number) {
  return (
    (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (ratingA - ratingB)) / 400))
  )
}

function eloRating(
  ratingA: number,
  ratingB: number,
  k = 30,
  winner: "a" | "b" = "a"
) {
  const probabilityAWins = expectedProbabilityOfWinning(ratingB, ratingA)
  const probabilityBWins = expectedProbabilityOfWinning(ratingA, ratingB)

  if (winner === "a") {
    ratingA = ratingA + k * (1 - probabilityAWins)
    ratingB = ratingB + k * (0 - probabilityBWins)
  } else {
    ratingA = ratingA + k * (0 - probabilityAWins)
    ratingB = ratingB + k * (1 - probabilityBWins)
  }
  return {
    ratingA,
    ratingB
  }
}

function getTwoRandomPokemonIds() {
  let firstRandomInt = _.random(1, 150)
  const secondRandomInt = _.random(1, 150)

  while (firstRandomInt === secondRandomInt) {
    firstRandomInt = _.random(1, 150)
  }
  return [firstRandomInt, secondRandomInt]
}
