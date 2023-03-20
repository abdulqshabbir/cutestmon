import { useState } from "react"
import { type NextPage } from "next"
import Link from "next/link"
import Head from "next/head"
import { VscRefresh } from "react-icons/vsc"
import { AiOutlineBarChart } from "react-icons/ai"
import { trpc } from "../utils/api"
import PokemonCard from "../components/ui/PokemonCard"

//test supabase

const Home: NextPage = () => {
  const { data, isError, isLoading, fetchStatus } =
    trpc.pokemons.twoRandom.useQuery(undefined, {
      queryKey: ["pokemons.twoRandom", undefined]
    })

  const [hasCastVote, setHasCastVote] = useState(false)

  if (isError) {
    return <div>Sorry something went wrong</div>
  }
  return (
    <>
      <Head>
        <title>Sharpest Pokemon</title>
        <meta
          name="description"
          content="Vote on which pokemon you think is most pointy!"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="m-8 mt-0 p-4 text-lg font-bold text-gray-500 sm:text-2xl">
          Which pokemon is more <span className="italic">pointy</span>?
        </h1>
        <div className="m-8 flex flex-col gap-8 sm:flex-row">
          <PokemonCard
            name={data?.[0]?.name}
            imageUrl={data?.[0]?.image}
            isLoading={isLoading}
            isFetching={fetchStatus === "fetching"}
            id={data?.[0]?.id}
            setHasCastVote={setHasCastVote}
            hasCastVote={hasCastVote}
          />
          <PokemonCard
            name={data?.[1]?.name}
            imageUrl={data?.[1]?.image}
            isLoading={isLoading}
            isFetching={fetchStatus === "fetching"}
            id={data?.[0]?.id}
            setHasCastVote={setHasCastVote}
            hasCastVote={hasCastVote}
          />
        </div>
        {hasCastVote && (
          <div className=" flex flex-col items-center justify-center sm:flex-row sm:gap-8">
            <button
              onClick={() => {
                setHasCastVote(false)
              }}
              className="m-4 flex items-center justify-center gap-2 rounded-lg bg-purple-200 py-4 px-8 text-gray-600 transition-all hover:scale-110"
            >
              <span>Vote Again</span>
              <VscRefresh />
            </button>
            <Link
              href="/leaderboard"
              className="mb-8 mt-0"
            >
              <button className="flex items-center justify-center gap-2 rounded-lg bg-green-200 py-4 px-8 text-gray-600 transition-all hover:scale-110">
                <span>Show Results</span>
                <AiOutlineBarChart />
              </button>
            </Link>
          </div>
        )}
      </main>
    </>
  )
}

export default Home
