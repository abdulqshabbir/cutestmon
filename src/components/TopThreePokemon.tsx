import Image from "next/image"
import { trpc } from "../utils/api"
import { RingSpinner } from "./ui/Spinner"
import { cn } from "../utils/cn"
import { useState } from "react"

export default function TopThreePokemon() {
  const { data, isError, isLoading } = trpc.pokemons.topThree.useQuery()
  const [active, setActive] = useState("week")

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
    "mx-auto rounded-full bg-gray-100 p-2 border-4 border-primary/10"

  const leaderboardButtonStyles =
    "py-1 px-2 rounded-md hover:bg-accent hover:text-accent-foreground hover:cursor-pointer"

  const pokemonNameStyles = "text-center text-sm text-slate-400"

  const activeStyles = "bg-accent text-accent-foreground"

  return (
    <>
      <div className="mb-4 flex justify-between rounded-md bg-primary/80 px-4 py-2 text-primary-foreground">
        <div
          className={cn({
            [leaderboardButtonStyles]: true,
            [activeStyles]: active === "today"
          })}
          onClick={() => {
            setActive("today")
          }}
        >
          Today
        </div>
        <div
          className={cn({
            [leaderboardButtonStyles]: true,
            [activeStyles]: active === "week"
          })}
          onClick={() => {
            setActive("week")
          }}
        >
          This Week
        </div>
        <div
          className={cn({
            [leaderboardButtonStyles]: true,
            [activeStyles]: active === "allTime"
          })}
          onClick={() => {
            setActive("allTime")
          }}
        >
          All Time
        </div>
      </div>
      <div className="mx-0 flex h-36 w-full flex-row justify-between md:px-16">
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
