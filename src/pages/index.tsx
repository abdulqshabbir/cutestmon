import type { Dispatch, SetStateAction } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { type NextPage } from "next"
import Link from "next/link"
import Head from "next/head"
import { VscRefresh } from "react-icons/vsc"
import { AiOutlineBarChart } from "react-icons/ai"
import { trpc } from "../utils/api"
import PokemonCard from "../components/ui/PokemonCard"
import { RingSpinner } from "../components/ui/Spinner"
import Button from "../components/ui/Button"
import toast, { Toaster } from "react-hot-toast"

const Home: NextPage = () => {
  const {
    data: twoPokemon,
    isError: isTwoPokemonError,
    isLoading: isLoadingTwoPokemon,
    isRefetching: isFetchingTwoPokemon
  } = trpc.pokemons.twoRandom.useQuery(undefined, {
    refetchOnWindowFocus: false,
    queryKey: ["pokemons.twoRandom", undefined]
  })

  const [hasCastVote, setHasCastVote] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [pokemonVotedFor, setPokemonVotedFor] = useState("")

  useEffect(() => {
    if (hasCastVote) {
      toast.success("You voted " + pokemonVotedFor + " is happier!", {
        duration: 3000
      })
    }
  }, [hasCastVote, pokemonVotedFor])

  if (isLoadingTwoPokemon) {
    return <RingSpinner />
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
          content="Vote on which pokemon you think is happiest :)"
        />
      </Head>
      <main className="flex h-screen flex-col items-center justify-start gap-4">
        <Toaster position="bottom-center" />
        <Title />
        {isVoting && (
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <RingSpinner
              fullScreen={false}
              width="300px"
            />
          </div>
        )}
        {!hasCastVote && !isVoting && (
          <div className="m-4 flex flex-col sm:flex-row">
            <PokemonCard
              name={twoPokemon?.[0]?.name}
              isLoadingTwoPokemon={isLoadingTwoPokemon || isFetchingTwoPokemon}
              id={twoPokemon?.[0]?.id}
              idVotedAgainst={twoPokemon?.[1]?.id}
              hasCastVote={hasCastVote}
              setHasCastVote={setHasCastVote}
              isVoting={isVoting}
              setIsVoting={setIsVoting}
              setPokemonVotedFor={setPokemonVotedFor}
            />
            <PokemonCard
              name={twoPokemon?.[1]?.name}
              isLoadingTwoPokemon={isLoadingTwoPokemon || isFetchingTwoPokemon}
              id={twoPokemon?.[1]?.id}
              idVotedAgainst={twoPokemon?.[0]?.id}
              hasCastVote={hasCastVote}
              setHasCastVote={setHasCastVote}
              isVoting={isVoting}
              setIsVoting={setIsVoting}
              setPokemonVotedFor={setPokemonVotedFor}
            />
          </div>
        )}
        {hasCastVote && (
          <Buttons
            hasCastVote={hasCastVote}
            setHasCastVote={setHasCastVote}
          />
        )}
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
    <div className="mb-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
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
      Which Pokemon <span className="italic">seems happier</span>? &#128512;
    </h1>
  )
}

export default Home
