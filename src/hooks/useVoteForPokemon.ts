import { type inferReactQueryProcedureOptions } from "@trpc/react-query"
import type { AppRouter } from "../server/api/root"
import { trpc } from "../utils/api"
import { useQueryClient } from "@tanstack/react-query"
import { getQueryKey } from "@trpc/react-query"

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>

type VoteForPokemonOptions = ReactQueryOptions["pokemons"]["voteById"]

export default function useVoteForPokemon(options?: VoteForPokemonOptions) {
  const queryClient = useQueryClient()

  const queryKey = getQueryKey(trpc.pokemons.twoRandom, undefined)

  return trpc.pokemons.voteById.useMutation({
    ...options,
    onMutate() {
      console.log("mutate")
      void queryClient.invalidateQueries({ queryKey })
    }
  })
}
