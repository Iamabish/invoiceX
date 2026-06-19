import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function Home() {

  const user = await auth.api.getSession({
    headers : await headers()
  })

  console.log('user', user?.user);
  


  return (
    <div>hy there</div>
  )
}
