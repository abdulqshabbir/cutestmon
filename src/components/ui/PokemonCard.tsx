import Image from "next/image"
import { type Dispatch, type SetStateAction, useState, useEffect } from "react"
import DefaultSpinner from "./Spinner"
import { trpc } from "../../utils/api"

interface PokemonCardProps {
  name?: string | undefined
  imageUrl?: string | undefined
  id: number | undefined
  isLoading: boolean
  hasCastVote: boolean
  setHasCastVote: Dispatch<SetStateAction<boolean>>
}

export default function PokemonCard({
  name,
  imageUrl,
  isLoading,
  id,
  hasCastVote,
  setHasCastVote
}: PokemonCardProps) {
  const [votedForThisPokemon, setHasVotedForThisPokemon] = useState(false)
  useEffect(() => {
    setHasVotedForThisPokemon(false)
  }, [hasCastVote])
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
      onClick={() => {
        if (!hasCastVote) {
          mutation.mutate({ id, name, image: imageUrl })
        }
      }}
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

function getTailwindClassesOnVote(
  hasCastVote: boolean,
  hasVotedForThisPokemon: boolean
) {
  let classes = ""
  if (hasCastVote && !hasVotedForThisPokemon) {
    classes += "bg-gray-200 opacity-30 hover:pointer-events-none"
  } else if (hasCastVote && hasVotedForThisPokemon) {
    classes += "bg-green-200 opacity-30 hover:pointer-events-none"
  } else if (!hasCastVote) {
    classes += "hover:scale-105 hover:cursor-pointer"
  }
  return classes
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
