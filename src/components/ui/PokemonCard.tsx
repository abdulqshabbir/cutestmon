import { useEffect } from "react"
import Image from "next/image"
import { type Dispatch, type SetStateAction } from "react"
import DefaultSpinner from "./Spinner"
import useVoteForPokemon from "../../hooks/useVoteForPokemon"

interface PokemonCardProps {
  name?: string | undefined
  imageUrl?: string | undefined
  id: number | undefined
  isVoting: boolean
  isLoadingTwoPokemon: boolean
  hasCastVote: boolean
  setHasCastVote: Dispatch<SetStateAction<boolean>>
  setIsVoting: Dispatch<SetStateAction<boolean>>
}

export default function PokemonCard({
  name,
  imageUrl,
  isLoadingTwoPokemon,
  id,
  hasCastVote,
  isVoting,
  setIsVoting,
  setHasCastVote
}: PokemonCardProps) {
  const mutation = useVoteForPokemon()

  useEffect(() => {
    if (mutation.isLoading) {
      setIsVoting(true)
    } else {
      setIsVoting(false)
    }

    if (mutation.isSuccess) {
      setHasCastVote(true)
    } else {
      setHasCastVote(false)
    }
  }, [mutation.isLoading, setIsVoting, setHasCastVote])

  if (isLoadingTwoPokemon || isVoting || !id || !name || !imageUrl) {
    return <SkeletonPokemonCard />
  }

  return (
    <>
      <div
        className="flex flex-col gap-2"
        onClick={() => {
          if (!isVoting) {
            void mutation.mutate({ id, name, image: imageUrl })
          }
        }}
      >
        <h2 className="mb-1 flex justify-center text-lg italic text-gray-400">
          {name}
        </h2>
        <div
          className={`m-4 rounded-3xl bg-gray-100 transition-all ${getTailwindClassesOnVote(
            hasCastVote
          )}`}
        >
          <Image
            priority
            src={imageUrl}
            alt=""
            width={400}
            height={400}
          />
        </div>
      </div>
    </>
  )
}

function getTailwindClassesOnVote(hasCastVote: boolean) {
  let classes = ""
  if (hasCastVote) {
    classes += "bg-gray-200 opacity-30 pointer-events-none"
  } else {
    classes += "hover:scale-105 hover:cursor-pointer"
  }
  return classes
}

function SkeletonPokemonCard() {
  return (
    <div className="m-4 flex flex-col">
      <div className="max-w-7/12 mb-4 flex h-8 animate-pulse self-center rounded-xl bg-gray-200"></div>
      <div className=" flex h-[300px] w-[300px] animate-pulse items-center justify-center rounded-3xl bg-gray-200 transition-all hover:scale-105 hover:cursor-pointer hover:bg-gray-200">
        <DefaultSpinner />
      </div>
    </div>
  )
}
