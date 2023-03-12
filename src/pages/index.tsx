import { type NextPage } from "next"
import Image from "next/image"
import Head from "next/head"
import { trpc } from "../utils/api"
import DefaultSpinner from "../components/ui/Spinner"

const Home: NextPage = () => {
  const { data, isError, isLoading } =
    trpc.pokemons.getTwoRandomPokemons.useQuery()
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
      <main className="flex min-h-screen flex-col items-center justify-center sm:gap-16">
        <h1 className="p-4 text-3xl font-extralight text-gray-700 sm:text-5xl">
          Which pokemon is more <span className="italic">pointy</span>?
        </h1>
        <div className="flex flex-col gap-8 sm:flex-row">
          <PokemonCard
            name={data?.[0]?.name}
            imageUrl={data?.[0]?.image}
            isLoading={isLoading}
            id={data?.[0]?.id}
          />
          <PokemonCard
            name={data?.[1]?.name}
            imageUrl={data?.[1]?.image}
            isLoading={isLoading}
            id={data?.[0]?.id}
          />
        </div>
      </main>
    </>
  )
}

interface PokemonCardProps {
  name?: string | undefined
  imageUrl?: string | undefined
  id: number | undefined
  isLoading: boolean
}

function PokemonCard({ name, imageUrl, isLoading, id }: PokemonCardProps) {
  const mutation = trpc.pokemons.voteForPokemonById.useMutation({
    onSuccess: () => {
      console.log("we voted!")
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
      <div className="rounded-3xl bg-gray-100 transition-all hover:scale-105 hover:cursor-pointer hover:bg-gray-200">
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

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession()

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   )
// }
