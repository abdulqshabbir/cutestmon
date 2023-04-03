import { useEffect } from "react"
import Image from "next/image"
import { type Dispatch, type SetStateAction } from "react"
import DefaultSpinner from "./Spinner"
import useVoteForPokemon from "../../hooks/useVoteForPokemon"

interface PokemonCardProps {
  name?: string | undefined
  id: number | undefined
  isVoting: boolean
  isLoadingTwoPokemon: boolean
  hasCastVote: boolean
  idVotedAgainst: number | undefined
  setHasCastVote: Dispatch<SetStateAction<boolean>>
  setIsVoting: Dispatch<SetStateAction<boolean>>
  setPokemonVotedFor: Dispatch<SetStateAction<string>>
}

export default function PokemonCard({
  name,
  isLoadingTwoPokemon,
  id,
  idVotedAgainst,
  hasCastVote,
  isVoting,
  setIsVoting,
  setHasCastVote,
  setPokemonVotedFor
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
      setPokemonVotedFor(mutation?.data?.name ?? "")
    } else {
      setHasCastVote(false)
      setPokemonVotedFor("")
    }
  }, [
    mutation.isLoading,
    mutation.isSuccess,
    mutation?.data?.name,
    setIsVoting,
    setHasCastVote,
    setPokemonVotedFor
  ])

  if (isLoadingTwoPokemon || isVoting || !id || !name || !idVotedAgainst) {
    return <SkeletonPokemonCard />
  }

  return (
    <>
      <div
        className="flex flex-col gap-2"
        onClick={() => {
          if (!isVoting) {
            void mutation.mutate({ id, idVotedAgainst })
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
            src={`/pokemon/${id}.png`}
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
      <div className=" flex h-[400px] w-[400px] animate-pulse items-center justify-center rounded-3xl bg-gray-200 transition-all hover:bg-gray-200">
        <DefaultSpinner />
      </div>
    </div>
  )
}
