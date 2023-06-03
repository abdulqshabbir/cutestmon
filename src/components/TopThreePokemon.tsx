import Image from "next/image"
import { trpc } from "../utils/api"
import { RingSpinner } from "./ui/Spinner"
import { cn } from "../utils/cn"
import styles from "./TopThreePokemon.module.css"
import type { LeaderboardTimeSpan } from "../pages/leaderboard"

export default function TopThreePokemon({
  setLeaderBoardTimeSpan,
  leaderboardTimeSpan
}: {
  setLeaderBoardTimeSpan: (time: LeaderboardTimeSpan) => void
  leaderboardTimeSpan: LeaderboardTimeSpan
}) {
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
            [activeStyles]: leaderboardTimeSpan === "today"
          })}
          onClick={() => {
            setLeaderBoardTimeSpan("today")
          }}
        >
          Today
        </div>
        <div
          className={cn({
            [leaderboardButtonStyles]: true,
            [activeStyles]: leaderboardTimeSpan === "allTime"
          })}
          onClick={() => {
            setLeaderBoardTimeSpan("allTime")
          }}
        >
          All Time
        </div>
        <div
          className={cn({
            [leaderboardButtonStyles]: true,
            [activeStyles]: leaderboardTimeSpan === "week"
          })}
          onClick={() => {
            setLeaderBoardTimeSpan("week")
          }}
        >
          This Week
        </div>
      </div>
      {leaderboardTimeSpan === "allTime" && (
        <>
          <div className="mx-0 flex h-36 w-full flex-row justify-center gap-8 md:px-16">
            <div className="self-center">
              <Image
                src={`/pokemon/${secondCutest.id}.png`}
                width={80}
                height={80}
                alt="Pokemon avatar"
                className={imageStyles}
              />
              <p className={pokemonNameStyles}>{secondCutest?.name}</p>
            </div>
            <div className="self-top">
              <Image
                src={`/pokemon/${cutest.id}.png`}
                width={80}
                height={80}
                alt="Pokemon avatar"
                className={imageStyles}
              />
              <p className={pokemonNameStyles}>{cutest?.name}</p>
            </div>
            <div className="self-center">
              <Image
                src={`/pokemon/${thridCutest.id}.png`}
                width={80}
                height={80}
                alt="Pokemon avatar"
                className={imageStyles}
              />
              <p className={pokemonNameStyles}>{thridCutest?.name}</p>
            </div>
          </div>
          <Podium />
        </>
      )}
    </>
  )
}

function Podium() {
  return (
    <div className="flex flex-row items-end justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className={`${styles?.["trapezoid-second-place"] ?? ""}`}></div>
        <div className="relative flex h-24 w-24 items-start justify-center bg-slate-200 pt-2">
          <p className="text-center align-bottom text-slate-500">2nd</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className={`${styles?.["trapezoid-first-place"] ?? ""}`}></div>
        <div className="relative flex h-36 w-24 items-start justify-center bg-amber-200 pt-2">
          <p className="text-center text-slate-500">1st</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className={`${styles?.["trapezoid-third-place"] ?? ""}`}></div>
        <div className="relative flex h-20 w-24 items-start  justify-center bg-amber-600 pt-2">
          <p className="text-center text-slate-900">3rd</p>
        </div>
      </div>
    </div>
  )
}
