import Image from "next/image"
import { trpc } from "../utils/api"
import { RingSpinner } from "./ui/Spinner"

export default function TopThreePokemon() {
  const { data, isError, isLoading } = trpc.pokemons.topThree.useQuery()

  if (isLoading) {
    return <RingSpinner />
  }
  if (isError || !data[0] || !data[1] || !data[2]) {
    return null
  }

  if (data.length < 3) {
    return null
  }

  const cutest = data[0]
  const secondCutest = data[1]
  const thridCutest = data[2]

  const imageStyles =
    "mx-auto rounded-full bg-gray-100 p-2 border-4 border-purple-100"

  const leaderboardButtonStyles =
    "py-1 px-2 hover:cursor-pointer hover:bg-white rounded-md"

  const pokemonNameStyles = "text-center text-sm text-slate-400"

  return (
    <>
      <div className="mx-8 mb-4 flex justify-between rounded-md bg-purple-100 px-4 py-2 text-purple-300">
        <div className={leaderboardButtonStyles}>Today</div>
        <div className={leaderboardButtonStyles + " text-purple-600"}>
          This Week
        </div>
        <div className={leaderboardButtonStyles}>All Time</div>
      </div>
      <div className="mx-auto flex h-36 w-96 flex-row justify-between ">
        <p className="self-center">
          <Image
            src={`/pokemon/${secondCutest.id}.png`}
            width={80}
            height={80}
            alt="Pokemon avatar"
            className={imageStyles}
          />
          <p className={pokemonNameStyles}>{secondCutest?.name}</p>
        </p>
        <p className="self-top">
          <Image
            src={`/pokemon/${cutest.id}.png`}
            width={80}
            height={80}
            alt="Pokemon avatar"
            className={imageStyles}
          />
          <p className={pokemonNameStyles}>{cutest?.name}</p>
        </p>
        <p className="self-center">
          <Image
            src={`/pokemon/${thridCutest.id}.png`}
            width={80}
            height={80}
            alt="Pokemon avatar"
            className={imageStyles}
          />
          <p className={pokemonNameStyles}>{thridCutest?.name}</p>
        </p>
      </div>
    </>
  )
}
