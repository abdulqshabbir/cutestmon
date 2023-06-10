import type { RouterOutputs } from "../utils/api"
import { trpc } from "../utils/api"
import { nanoid } from "nanoid"
import Image from "next/image"
import Button from "../components/ui/Button"
import { RingSpinner } from "../components/ui/Spinner"
import TopThreePokemon from "../components/TopThreePokemon"
import Heading from "../components/ui/Heading"
import { useState } from "react"
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai"
import { BsDashLg } from "react-icons/bs"
import Anchor from "../components/ui/Anchor"

export type LeaderboardTimeSpan = "today" | "week" | "allTime"

type AllTimeLeaderboardPokemons =
  RouterOutputs["pokemons"]["allInfinite"]["pokemons"]
type WeeklyLeaderboardPokemons =
  RouterOutputs["pokemons"]["getWeeklyRanking"]["pokemons"]

export default function Leaderboard() {
  const {
    isLoading: isLoadingAllTimePokemons,
    isError: isAllTimePokemonError,
    data: allTimeData,
    error,
    fetchNextPage: fetchNextAllTimePokemonPage,
    isFetchingNextPage: isFetchingAllTimeNextPokemonPage,
    hasNextPage: hasNextAllTimePokemonPage
  } = trpc.pokemons.allInfinite.useInfiniteQuery(
    { take: 30 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  )

  const {
    data: weeklyData,
    isLoading: isLoadingWeeklyPokemons,
    fetchNextPage: fetchNextWeeklyPokemonPage,
    isFetchingNextPage: isFetchingWeeklyPokemonPage,
    hasNextPage: hasNextWeeklyPokemonPage
  } = trpc.pokemons.getWeeklyRanking.useInfiniteQuery(
    {
      take: 5
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  )

  const [leaderboardTimeSpan, setLeaderBoardTimeSpan] =
    useState<LeaderboardTimeSpan>("allTime")

  if (isLoadingAllTimePokemons || isLoadingWeeklyPokemons) {
    return <RingSpinner />
  }

  if (isAllTimePokemonError) {
    return error.message
  }

  if (!weeklyData) {
    return "No weekly data"
  }

  let tableData: AllTimeLeaderboardPokemons | WeeklyLeaderboardPokemons = []

  if (leaderboardTimeSpan === "allTime") {
    tableData = allTimeData.pages.flatMap((page) => page.pokemons)
  } else if (leaderboardTimeSpan === "week") {
    tableData = weeklyData.pages.flatMap((page) => page.pokemons)
  }

  return (
    <div className="mx-auto mt-8 max-w-md">
      <Heading
        as="h1"
        size="lg"
        className="mb-2 text-center"
      >
        Pokemon Leaderboard
      </Heading>
      <TopThreePokemon
        leaderboardTimeSpan={leaderboardTimeSpan}
        setLeaderBoardTimeSpan={setLeaderBoardTimeSpan}
      />
      {!tableData || tableData?.length === 0 ? (
        <div className="flex h-64 flex-col justify-center">
          <p className="my-2 text-center text-gray-400">
            No data for the week yet &#128558;
          </p>
          <div className="my-2 flex items-center justify-center">
            <Anchor
              variant="primary"
              className="h-12 w-[150px]"
              href="/"
            >
              Vote Now
            </Anchor>
          </div>
        </div>
      ) : (
        <>
          <table className="w-full">
            <tbody className="rounded-lg border-2 border-gray-50">
              {tableData.map(
                (
                  pokemon:
                    | AllTimeLeaderboardPokemons[number]
                    | WeeklyLeaderboardPokemons[number],
                  i
                ) => (
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
                          {`${Math.floor(pokemon.ranking)} pts`}{" "}
                          {leaderboardTimeSpan !== "allTime"
                            ? "(All Time Points)"
                            : null}
                        </p>
                      </div>
                    </td>
                    {leaderboardTimeSpan === "week" ? (
                      <td className="text-sm font-light text-slate-400">
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <LeaderboardTrendIcon pokemon={pokemon} />
                      </td>
                    ) : (
                      <td className="text-sm font-light text-slate-400">
                        {i + 1}
                        <span className="align-super text-xs">
                          {generateSuffix(i + 1)}
                        </span>
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
          <HasMorePokemonButton
            fetchNextAllTimePokemonPage={fetchNextAllTimePokemonPage}
            isFetchingAllTimeNextPokemonPage={isFetchingAllTimeNextPokemonPage}
            hasNextAllTimePokemonPage={Boolean(hasNextAllTimePokemonPage)}
            fetchNextWeeklyPokemonPage={fetchNextWeeklyPokemonPage}
            isFetchingWeeklyPokemonPage={isFetchingWeeklyPokemonPage}
            hasNextWeeklyPokemonPage={Boolean(hasNextWeeklyPokemonPage)}
            leaderboardTimeSpan={leaderboardTimeSpan}
          />
        </>
      )}
    </div>
  )
}

function LeaderboardTrendIcon({
  pokemon
}: {
  pokemon: WeeklyLeaderboardPokemons[number]
}) {
  if (pokemon?.aggregateVotes === 0) {
    return (
      <BsDashLg
        className="text-slate-400"
        size={30}
      />
    )
  } else if (pokemon?.aggregateVotes && pokemon.aggregateVotes > 0) {
    return (
      <AiOutlineCaretUp
        className="text-green-500"
        size={30}
      />
    )
  }
  return (
    <AiOutlineCaretDown
      className="text-red-500"
      size={30}
    />
  )
}

interface HasMorePokemonButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchNextAllTimePokemonPage: any
  isFetchingAllTimeNextPokemonPage: boolean
  hasNextAllTimePokemonPage: boolean

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchNextWeeklyPokemonPage: any
  isFetchingWeeklyPokemonPage: boolean
  hasNextWeeklyPokemonPage: boolean

  leaderboardTimeSpan: LeaderboardTimeSpan
}

function HasMorePokemonButton({
  fetchNextAllTimePokemonPage,
  isFetchingAllTimeNextPokemonPage,
  hasNextAllTimePokemonPage,
  fetchNextWeeklyPokemonPage,
  isFetchingWeeklyPokemonPage,
  hasNextWeeklyPokemonPage,
  leaderboardTimeSpan
}: HasMorePokemonButtonProps) {
  if (leaderboardTimeSpan === "allTime" && hasNextAllTimePokemonPage) {
    return (
      <div className="flex items-center justify-center">
        <Button
          variant="secondary"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          onClick={() => void fetchNextAllTimePokemonPage()}
          isLoading={isFetchingAllTimeNextPokemonPage}
          className="mt-4 mb-8 w-full"
          fullWidth
        >
          Fetch Next 30 Pokemon
        </Button>
      </div>
    )
  } else if (leaderboardTimeSpan === "week" && hasNextWeeklyPokemonPage) {
    return (
      <div className="flex items-center justify-center">
        <Button
          variant="secondary"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          onClick={() => void fetchNextWeeklyPokemonPage()}
          isLoading={isFetchingWeeklyPokemonPage}
          className="mt-4 mb-8 w-full"
          fullWidth
        >
          Fetch Next 5 Pokemon
        </Button>
      </div>
    )
  }
  return null
}

function generateSuffix(num: number) {
  if (num % 10 === 1) return "st"
  if (num % 10 === 2) return "nd"
  if (num % 10 === 3 && num !== 13) return "rd"
  return "th"
}
