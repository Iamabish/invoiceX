'use server'
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"


export async  function signUp(formData : FormData) {
    try {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
    
    
        console.log('name',name);
        console.log("email",email);
        console.log("password",password);
        
        
    
        const res = await auth.api.signUpEmail({
            body :{
                name,
                
                password,
                email
            }
        })

        console.log('res', res);
        

    } catch (error) {
        console.log('error', error);
    }

    redirect('/')

}


export async function signIn(formData : FormData) {
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string
    
        console.log("email",email);
        console.log("password",password);
    
        const res = await auth.api.signInEmail({
            body :{
                email,
                password
            }
        })

        console.log('res', res);
    } catch (error) {
        console.log('error', error);
        
    }

    redirect('/')

}

export async function logout() {
    await auth.api.signOut({
        headers : await headers()
    })
}