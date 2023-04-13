import { appRouter } from "../root"
import { describe, it, expect } from "vitest"
import { createInnerTRPCContext } from "../trpc"

describe("pokemon.all", () => {
  it("returns all 150 Pokemon from pokeApI", async () => {
    const caller = appRouter.createCaller(
      createInnerTRPCContext({ session: null })
    )
    const pokemon = await caller.pokemons.all()
    expect(pokemon.length).toBe(150)
  })

  it("returns bulbasaur as first pokemon from pokeAPI", async () => {
    const caller = appRouter.createCaller(
      createInnerTRPCContext({ session: null })
    )
    const pokemon = await caller.pokemons.all()
    const bulbasaur = pokemon[0]
    expect(bulbasaur?.name).toBe("bulbasaur")
    expect(bulbasaur?.id).toBe(1)
  })
})
