import { trpc } from "../utils/api"
import Table from "../components/ui/Table"

export default function Leaderboard() {
  const { isLoading, isError, data, error } = trpc.pokemons.getAllPokemons.useQuery()
  if (isLoading) {
    return "Loading..."
  }

  if (isError) {
    return error.message
  }

  const pokemons = data.map((pokemon, i) => ({
    ...pokemon,
    rank: i,
    pointsFor: i
  }))


  return <Table data={pokemons} columns={["rank", "pointsFor", "name", "image"]}/>
}