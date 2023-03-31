import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { type NextPage } from "next"
import Link from "next/link"
import Head from "next/head"
import { VscRefresh } from "react-icons/vsc"
import { AiOutlineBarChart } from "react-icons/ai"
import { trpc } from "../utils/api"
import PokemonCard from "../components/ui/PokemonCard"
import DefaultSpinner from "../components/ui/Spinner"
import Button from "../components/ui/Button"

const Home: NextPage = () => {
  const {
    data: twoPokemon,
    isError: isTwoPokemonError,
    isLoading: isLoadingTwoPokemon
  } = trpc.pokemons.twoRandom.useQuery(undefined, {
    refetchOnWindowFocus: false,
    queryKey: ["pokemons.twoRandom", undefined]
  })

  const [hasCastVote, setHasCastVote] = useState(false)

  if (isLoadingTwoPokemon) {
    return <DefaultSpinner />
  }

  if (isTwoPokemonError) {
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
      <main className="flex min-h-screen flex-col items-center justify-start">
        <Title />
        <div className="m-4 flex flex-col sm:flex-row">
          <PokemonCard
            name={twoPokemon?.[0]?.name}
            imageUrl={twoPokemon?.[0]?.image}
            isLoadingTwoPokemon={isLoadingTwoPokemon}
            id={twoPokemon?.[0]?.id}
            setHasCastVote={setHasCastVote}
            hasCastVote={hasCastVote}
          />
          <PokemonCard
            name={twoPokemon?.[1]?.name}
            imageUrl={twoPokemon?.[1]?.image}
            isLoadingTwoPokemon={isLoadingTwoPokemon}
            id={twoPokemon?.[0]?.id}
            setHasCastVote={setHasCastVote}
            hasCastVote={hasCastVote}
          />
        </div>
        <Buttons
          hasCastVote={hasCastVote}
          setHasCastVote={setHasCastVote}
        />
      </main>
    </>
  )
}

interface ButtonsProps {
  hasCastVote: boolean
  setHasCastVote: Dispatch<SetStateAction<boolean>>
}

function Buttons({ hasCastVote, setHasCastVote }: ButtonsProps) {
  return hasCastVote ? (
    <div className="m-4 flex flex-col items-center justify-center sm:flex-row sm:gap-8">
      <Button
        variant="secondary"
        onClick={() => {
          setHasCastVote(false)
        }}
      >
        <span>Vote Again</span>
        <VscRefresh />
      </Button>
      <Link
        href="/leaderboard"
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-300 py-4 px-8 font-bold text-white transition-all hover:scale-105"
      >
        <span>Show Results</span>
        <AiOutlineBarChart />
      </Link>
    </div>
  ) : null
}

function Title() {
  return (
    <h1 className="p-0 text-lg font-bold text-gray-500 sm:m-2 sm:text-2xl">
      Which pokemon is more <span className="italic">pointy</span>?
    </h1>
  )
}

export default Home
