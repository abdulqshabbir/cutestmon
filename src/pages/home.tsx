import { nanoid } from "nanoid"
import { trpc } from "../utils/api"
import Image from "next/image"

export default function Home() {
  const { isLoading, isError, data, error } = trpc.pokemons.getAllPokemons.useQuery()
  if (isLoading) {
    return "Loading..."
  }

  if (isError) {
    return error.message
  }
  return (
    <>
    {data.map((pokemon, i) => (
      <div key={nanoid()}>
        <h3>{pokemon.name}</h3>
        {/* // eslint-disable-next-line @next/next/no-img-element */}
        <Image src={pokemon.image} alt="pokemon" width={100} height={100} priority={i < 10} />
      </div>
    ))}
    </>
  )
}