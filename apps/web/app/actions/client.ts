"use server"
import { auth } from "@/lib/auth"
import {prisma} from "@invoicex/db"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"


export async function addClient(fomrData : FormData) {

    const user = await auth.api.getSession({
    headers : await headers()
    })

    try {

        console.log('at add client ');
        
        
    const name = fomrData.get("name") as string
    const email = fomrData.get("email") as string
    const company = fomrData.get("company") as string
    const phone = fomrData.get("phone") as string
    const address = fomrData.get("address") as string

    console.log(name);
    console.log(email);
    console.log(company);
    
    const client = await prisma.client.create({
        data :{
            name,
            email,
            company,
            userId : user?.user.id!,
            phone : phone,
            address : address,
        }
    })

    console.log('new client', client)


    }catch(err) {
        console.log('error', err);
        throw err
    }


    revalidatePath('/daashboard/clients')
}

export async function editClient(clientId : string, fomrData : FormData) {

    const user = await auth.api.getSession({
    headers : await headers()
})


    try {
        const name = fomrData.get("name") as string
        const email = fomrData.get("email") as string
        const company = fomrData.get("company") as string
        const phone = fomrData.get("phone") as string
        const address = fomrData.get("address") as string
    

    const isClient = await prisma.client.findUnique({
        where :{
            id : clientId,
            userId : user?.user.id
        }
    })

    if(!isClient) {
        throw new Error('Invalid operaton')
    }

    const client = await prisma.client.update({
        where :{
            id : isClient.id
        },
        data :{
            name : name,
            email : email,
            company : company,
            phone : phone,
            address : address
        }
    })



    }catch(err) {

        console.log('error', err);
        throw err

    }

    
    revalidatePath('/daashboard/clients')
}

export async function deleteClient(clientId : string) {

    const user = await auth.api.getSession({
    headers : await headers()
})


console.log('at delete client ');


    try {
    
        const isClient = await prisma.client.findUnique({
            where :{
                id : clientId,
                userId : user?.user.id
            }
        })
    
        if(!isClient) {
            throw new Error('Invalid operaton')
        }
    
        await prisma.client.delete({where : {id : clientId}})
        
 
    

    } catch (err) {
        console.log('err', err);
        throw err
        
    }


    revalidatePath('/daashboard/clients')
}