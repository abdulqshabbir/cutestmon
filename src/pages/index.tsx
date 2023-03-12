import { type Dispatch, type SetStateAction, useState } from "react"
import { type NextPage } from "next"
import Link from "next/link"
import Image from "next/image"
import Head from "next/head"
import { VscRefresh } from "react-icons/vsc"
import { AiOutlineBarChart } from "react-icons/ai"
import { trpc } from "../utils/api"
import DefaultSpinner from "../components/ui/Spinner"

const Home: NextPage = () => {
  const { data, isError, isLoading } =
    trpc.pokemons.getTwoRandomPokemons.useQuery(undefined, {
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
            <button className="flex items-center justify-center gap-2 rounded-lg bg-purple-200 py-4 px-8 text-gray-600 transition-all hover:scale-110 ">
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

interface PokemonCardProps {
  name?: string | undefined
  imageUrl?: string | undefined
  id: number | undefined
  isLoading: boolean
  hasCastVote: boolean
  setHasCastVote: Dispatch<SetStateAction<boolean>>
}

function getTailwindClassesOnVote(
  hasCastVote: boolean,
  hasVotedForThisPokemon: boolean
) {
  let classes = ""
  if (hasCastVote && !hasVotedForThisPokemon) {
    classes += "bg-gray-200 opacity-30 hover:pointer-events-none"
  } else if (hasCastVote && hasVotedForThisPokemon) {
    classes += "bg-green-200 opacity-30 hover:pointer-events-none"
  }
  return classes
}

function PokemonCard({
  name,
  imageUrl,
  isLoading,
  id,
  hasCastVote,
  setHasCastVote
}: PokemonCardProps) {
  const [votedForThisPokemon, setHasVotedForThisPokemon] = useState(false)
  const mutation = trpc.pokemons.voteForPokemonById.useMutation({
    onSuccess: () => {
      console.log("we voted!")
      setHasCastVote(true)
      setHasVotedForThisPokemon(true)
    },
    onError: (error) => {
      console.log("We failed :(")
      console.log(error.message, error.data?.code)
    }
  })

  if (!name || !imageUrl || !id || isLoading) {
    return <SkeletonPokemonCard />
  }

  return (
    <div
      className="flex flex-col gap-2"
      onClick={() => mutation.mutate({ id, name, image: imageUrl })}
    >
      <h2 className="mb-1 flex justify-center text-lg italic text-gray-400">
        {name}
      </h2>
      <div
        className={`rounded-3xl bg-gray-100 transition-all ${getTailwindClassesOnVote(
          hasCastVote,
          votedForThisPokemon
        )}`}
      >
        <Image
          src={imageUrl}
          alt=""
          width={400}
          height={400}
        />
      </div>
    </div>
  )
}

function SkeletonPokemonCard() {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex h-8 w-7/12 animate-pulse self-center rounded-xl bg-gray-200"></div>
      <div className=" flex h-[400px] w-[400px] animate-pulse items-center justify-center rounded-3xl bg-gray-200 transition-all hover:scale-105 hover:cursor-pointer hover:bg-gray-200">
        <DefaultSpinner />
      </div>
    </div>
  )
}

export default Home
