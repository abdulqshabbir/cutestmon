import { trpc } from "../utils/api"
import { nanoid } from "nanoid"
import Image from "next/image"
import { type CSSProperties } from "react"

interface Column {
  key: string
  width: string
  header: string
  styles?: CSSProperties
}

export default function Leaderboard() {
  const { isLoading, isError, data, error } =
    trpc.pokemons.allInfinite.useInfiniteQuery(
      { take: 30 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )

  if (isLoading) {
    return "Loading..."
  }

  if (isError) {
    return error.message
  }

  const pokemons = data.pages
    .flatMap((page) => page.pokemons)
    .map((pokemon, i) => ({
      ...pokemon,
      rank: i,
      pointsFor: i
    }))

  const columns: Column[] = [
    {
      key: "rank",
      width: "20%",
      header: "Rank"
    },
    {
      key: "name",
      width: "60%",

      header: "Pokemon"
    },
    {
      key: "votes",
      width: "20%",
      header: "Votes"
    }
  ]

  return (
    <div className="mx-auto mt-8 max-w-md text-gray-600">
      <div className="mb-2 flex justify-between">
        <h1 className="font-bold">Sharpest Pokemon Ranking</h1>
      </div>
      <table className="w-full">
        <thead className="h-[30px] bg-gray-100">
          <tr>
            {columns.map((col) => (
              <td
                key={col.header}
                width={col.width}
                className="p-2 pb-1"
              >
                {col.header}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {pokemons.map((pokemon, i) => (
            <tr
              key={nanoid()}
              className="my-auto h-20 min-w-[800px] border-b-[4px] border-gray-50"
            >
              <td className="w-[20%] pl-6">{i + 1}</td>
              <td className="pl flex h-20 items-center justify-start gap-4">
                <div className="rounded p-1">
                  <Image
                    src={pokemon.image}
                    width={60}
                    height={60}
                    alt="Pokemon avatar"
                  />
                </div>
                <p>{pokemon.name}</p>
              </td>
              <td className="pl-6">{pokemon.votes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
