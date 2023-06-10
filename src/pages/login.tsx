import type { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"

const Login: NextPage = () => {
  const session = useSession()
  return (
    <>
      {session.data?.user?.name && (
        <>
          <div>{session.data.user.name} Loged in!</div>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
      )}
      {session.status === "authenticated" ? (
        <button
          onClick={() => {
            void signOut()
          }}
        >
          Log out{" "}
        </button>
      ) : (
        <button
          onClick={() => {
            void signIn("google")
          }}
        >
          Login
        </button>
      )}
    </>
  )
}

export default Login
