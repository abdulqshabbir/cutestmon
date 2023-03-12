import { useState } from "react"
import { type NextPage } from "next"
import Link from "next/link"
import Head from "next/head"
import { VscRefresh } from "react-icons/vsc"
import { AiOutlineBarChart } from "react-icons/ai"
import { trpc } from "../utils/api"
import PokemonCard from "../components/ui/PokemonCard"

const Home: NextPage = () => {
  const { data, isError, isLoading } =
    trpc.pokemons.getTwoRandomPokemons.useQuery(undefined, {
      queryKey: ["pokemons.getTwoRandomPokemons", undefined],
      retry: false,
      refetchOnWindowFocus: false
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
      <main className="flex min-h-screen flex-col items-center justify-center sm:gap-8">
        <h1 className="p-4 text-3xl font-light text-gray-500 sm:text-5xl">
          Which pokemon is more <span className="italic">pointy</span>?
        </h1>
        <div className="flex flex-col gap-8 sm:flex-row">
          <PokemonCard
            name={data?.[0]?.name}
            imageUrl={data?.[0]?.image}
            isLoading={isLoading}
            id={data?.[0]?.id}
            setHasCastVote={setHasCastVote}
            hasCastVote={hasCastVote}
          />
          <PokemonCard
            name={data?.[1]?.name}
            imageUrl={data?.[1]?.image}
            isLoading={isLoading}
            id={data?.[0]?.id}
            setHasCastVote={setHasCastVote}
            hasCastVote={hasCastVote}
          />
        </div>
        {hasCastVote && (
          <div className=" flex justify-center gap-8">
            <button
              onClick={() => {
                setHasCastVote(false)
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-200 py-4 px-8 text-gray-600 transition-all hover:scale-110 "
            >
              <span>Vote Again</span>
              <VscRefresh />
            </button>
            <button className=" flex items-center justify-center gap-2 rounded-lg bg-green-200 py-4 px-8 text-gray-600 transition-all hover:scale-110">
              <Link href="/leaderboard">Show Results</Link>
              <AiOutlineBarChart />
            </button>
          </div>
        )}
      </main>
    </>
  )
}

export default Home
