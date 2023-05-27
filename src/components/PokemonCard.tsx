import Image from "next/image"
import { type Dispatch, type SetStateAction } from "react"
import { RingSpinner } from "./ui/Spinner"
import useVoteForPokemon from "../hooks/useVoteForPokemon"

interface PokemonCardProps {
  name?: string | undefined
  id: number | undefined
  isVoting: boolean
  isLoadingTwoPokemon: boolean
  hasCastVote: boolean
  idVotedAgainst: number | undefined
  blob: unknown
  setHasCastVote: Dispatch<SetStateAction<boolean>>
  setIsVoting: Dispatch<SetStateAction<boolean>>
  setPokemonVotedFor: Dispatch<SetStateAction<string>>
}

function getImageUrl(id: number) {
  return process.env.NODE_ENV === "production"
    ? `https://d3h67ipnikmm2c.cloudfront.net/${id}.png`
    : `/pokemon/${id}.png`
}

export default function PokemonCard({
  name,
  blob,
  isLoadingTwoPokemon,
  id,
  idVotedAgainst,
  hasCastVote,
  isVoting,
  setIsVoting,
  setHasCastVote,
  setPokemonVotedFor
}: PokemonCardProps) {
  const mutation = useVoteForPokemon({
    onSuccess(data) {
      setHasCastVote(true)
      setPokemonVotedFor(data.name)
    },
    onSettled() {
      setIsVoting(false)
    }
  })

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
            setIsVoting(true)
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64, ${blob as string}`}
            alt=""
            width={300}
            height={300}
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
    classes += "hover:bg-primary/80 hover:cursor-pointer"
  }
  return classes
}

function SkeletonPokemonCard() {
  return (
    <div className="m-4 flex flex-col">
      <div className="max-w-7/12 mb-4 flex h-8 animate-pulse self-center rounded-xl bg-gray-300"></div>
      <div className=" flex h-[300px] w-[300px] animate-pulse items-center justify-center rounded-3xl bg-gray-200 transition-all hover:bg-gray-200">
        <RingSpinner />
      </div>
    </div>
  )
}
