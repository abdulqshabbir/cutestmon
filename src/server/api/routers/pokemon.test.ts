import { appRouter } from "../root"
import { describe, it, expect } from "vitest"
import { createInnerTRPCContextForTesting } from "../trpc"
import { mockDeep } from "vitest-mock-extended"
import type { Pokemon } from "@prisma/client"
import { type PrismaClient } from "@prisma/client"
import { prisma } from "../../db"

describe("pokemon route", async () => {
  const mockPrisma = mockDeep<PrismaClient>()
  const mockOutput: Pokemon[] = [
    {
      id: 34,
      name: "hello",
      ranking: 322
    }
  ]

  mockPrisma.pokemon.findMany.mockResolvedValue(mockOutput)

  const caller = appRouter.createCaller(
    createInnerTRPCContextForTesting({ session: null, prisma: prisma })
  )

  await caller.pokemons.all()

  it("hello vitest", () => {
    expect(1 + 1).toBe(2)
  })
})
