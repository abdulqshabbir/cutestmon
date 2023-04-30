import type { Dispatch, SetStateAction } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { type NextPage } from "next"
import Head from "next/head"
import { VscRefresh } from "react-icons/vsc"
import { AiOutlineBarChart } from "react-icons/ai"
import { trpc } from "../utils/api"
import PokemonCard from "../components/PokemonCard"
import { RingSpinner } from "../components/ui/Spinner"
import Button from "../components/ui/Button"
import toast, { Toaster } from "react-hot-toast"
import Anchor from "../components/ui/Anchor"
import Footer from "../components/Footer"
import Heading from "../components/ui/Heading"

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
      <body className="flex h-screen flex-col items-center justify-between gap-4">
        <Toaster
          position="bottom-center"
          containerStyle={{
            bottom: 80
          }}
        />
        {!hasCastVote && <Title />}
        <main>
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
                isLoadingTwoPokemon={
                  isLoadingTwoPokemon || isFetchingTwoPokemon
                }
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
                isLoadingTwoPokemon={
                  isLoadingTwoPokemon || isFetchingTwoPokemon
                }
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
        <Footer />
      </body>
    </>
  )
}

interface ButtonsProps {
  hasCastVote: boolean
  setHasCastVote: Dispatch<SetStateAction<boolean>>
}

function Buttons({ hasCastVote, setHasCastVote }: ButtonsProps) {
  return hasCastVote ? (
    <div className="mb-4 flex flex-col items-center justify-center gap-4">
      <Button
        variant="secondary"
        onClick={() => {
          setHasCastVote(false)
        }}
      >
        <span>Vote Again</span>
        <VscRefresh />
      </Button>
      <Anchor
        variant="primary"
        href="/leaderboard"
      >
        <span>Show Results</span>
        <AiOutlineBarChart />
      </Anchor>
    </div>
  ) : null
}

function Title() {
  return (
    <Heading variant="h1">
      Which Pokemon <span className="italic">seems happier</span>? &#128512;
    </Heading>
  )
}

export default Home
