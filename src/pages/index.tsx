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
import { MUTED_FOREGROUND, PRIMARY, SECONDARY } from "../styles/colors"
import { twMerge } from "tailwind-merge"
import clsx from "clsx"

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
        duration: 3000,
        style: {
          color: MUTED_FOREGROUND
        },
        iconTheme: {
          primary: PRIMARY,
          secondary: SECONDARY
        }
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
      <div className="flex h-screen flex-col items-center justify-between gap-4 sm:p-0">
        <Toaster position="top-center" />
        {!hasCastVote && (
          <div>
            <Title />
            <Subtitle />
          </div>
        )}
        <main
          className={twMerge(
            clsx({
              "relative top-[calc(50%-80px)]": hasCastVote
            })
          )}
        >
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
              {/* test */}
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
      </div>
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
    <Heading
      as="h1"
      className="mt-2 text-center md:mt-8"
    >
      Cutest Pok&eacute;mon
    </Heading>
  )
}

function Subtitle() {
  return (
    <Heading
      as="h2"
      size="md"
      className="max-w-md text-center lg:max-w-none"
    >
      Decide &#8212; once and for all &#8212; which Pokemon is the cutest of
      them all.
    </Heading>
  )
}

export default Home
