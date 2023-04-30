import { trpc } from "../utils/api"
import { nanoid } from "nanoid"
import Image from "next/image"
import Button from "../components/ui/Button"
import { RingSpinner } from "../components/ui/Spinner"
import TopThreePokemon from "../components/TopThreePokemon"

export default function Leaderboard() {
  const {
    isLoading,
    isError,
    data,
    error,
    fetchNextPage: fetchNextPokemonPage,
    isFetchingNextPage: isFetchingNextPokemonPage,
    hasNextPage: hasNextPokemonPage
  } = trpc.pokemons.allInfinite.useInfiniteQuery(
    { take: 30 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  )

  if (isLoading) {
    return <RingSpinner />
  }

  if (isError) {
    return error.message
  }

  const pokemons = data.pages.flatMap((page) => page.pokemons)

  return (
    <div className="mx-auto mt-8 max-w-md text-gray-600">
      <h1 className="mb-4 text-center font-bold text-slate-500">
        Pokemon Leaderboard
      </h1>
      <TopThreePokemon />
      <div className="mb-2 flex justify-between"></div>
      <table className="w-full">
        <tbody className="rounded-lg border-2 border-gray-50">
          {pokemons.map((pokemon, i) => (
            <tr
              key={nanoid()}
              className="my-auto h-20 max-w-[200px] border-b-[1px] border-b-slate-200 first-of-type:rounded-t-[40px]"
            >
              <td className="pl flex h-20 items-center justify-start gap-4">
                <div className="rounded p-1">
                  <Image
                    src={`/pokemon/${pokemon.id}.png`}
                    width={60}
                    height={60}
                    alt="Pokemon avatar"
                  />
                </div>
                <div>
                  <p className="text-slate-500">{pokemon.name}</p>
                  <p className="text-sm font-light text-slate-400">
                    {`${Math.floor(pokemon.ranking)} pts`}
                  </p>
                </div>
              </td>
              <td className="text-sm font-light text-slate-400">
                {i + 1}
                <span className="align-super text-xs">
                  {generateSuffix(i + 1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hasNextPokemonPage && (
        <div className="flex items-center justify-center">
          <Button
            variant="secondary"
            onClick={() => void fetchNextPokemonPage()}
            isLoading={isFetchingNextPokemonPage}
            className="mt-4 mb-8 w-full"
            fullWidth
          >
            Fetch Next 30 Pokemon
          </Button>
        </div>
      )}
    </div>
  )
}

function generateSuffix(num: number) {
  if (num % 10 === 1) return "st"
  if (num % 10 === 2) return "nd"
  if (num % 10 === 3 && num !== 13) return "rd"
  return "th"
}
