
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { use } from "react";

export default async function Home() {

  const user = await auth.api.getSession({
    headers : await headers()
  })

  

  console.log('user', user?.user);
  


  return (
   <>
    <Navbar />
    <Hero />
    <Footer />
   </>
  )
}
