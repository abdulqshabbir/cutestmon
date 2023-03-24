import Image from "next/image"
import { type Dispatch, type SetStateAction } from "react"
import DefaultSpinner from "./Spinner"
import { trpc } from "../../utils/api"
import { MdErrorOutline } from "react-icons/md"
import { IoIosCheckmarkCircle } from "react-icons/Io"
import toast, { Toaster } from "react-hot-toast"

interface PokemonCardProps {
  name?: string | undefined
  imageUrl?: string | undefined
  id: number | undefined
  isLoading: boolean
  hasCastVote: boolean
  isFetching: boolean
  setHasCastVote: Dispatch<SetStateAction<boolean>>
}

export default function PokemonCard({
  name,
  imageUrl,
  isLoading,
  id,
  hasCastVote,
  setHasCastVote,
  isFetching
}: PokemonCardProps) {
  const util = trpc.useContext().pokemons
  const mutation = trpc.pokemons.voteById.useMutation({
    onSuccess() {
      void util.twoRandom.invalidate()
      toast("You successfully voted", {
        duration: 3000,
        icon: (
          <div>
            <IoIosCheckmarkCircle className=" text-green-600" />
          </div>
        )
      })
    },
    onMutate() {
      setHasCastVote(true)
    },
    onError: () => {
      toast("Sorry, something went wrong with while voting", {
        duration: 3000,
        icon: (
          <div>
            <MdErrorOutline className="text-yellow-500" />
          </div>
        )
      })
    }
  })

  if (!name || !imageUrl || !id || isLoading) {
    return <SkeletonPokemonCard />
  }

  return (
    <>
      <Toaster />
      <div
        className="flex flex-col gap-2"
        onClick={() => {
          if (!isFetching && !mutation.isLoading) {
            mutation.mutate({ id, name, image: imageUrl })
          }
        }}
      >
        <h2 className="mb-1 flex justify-center text-lg italic text-gray-400">
          {name}
        </h2>
        <div
          className={`m-4 rounded-3xl bg-gray-100 transition-all ${getTailwindClassesOnVote(
            isFetching,
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

function getTailwindClassesOnVote(isFetching: boolean, hasCastVote: boolean) {
  let classes = ""
  if (isFetching || hasCastVote) {
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
