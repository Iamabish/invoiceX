import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

const user = await auth.api.getSession()

export async function addClient(fomrData : FormData) {
    try {
        
    const name = fomrData.get("name") as string
    const email = fomrData.get("email") as string
    const company = fomrData.get("company") as string
    
    const client = await prisma.client.create({
        data :{
            name,
            email,
            company,
            userId : user?.user.id!
        }
    })

    console.log('new client', client)

    return {success : true, client}
    

    }catch(err) {

        console.log('error', err);
        

    }
}

export async function editClient(fomrData : FormData) {
    try {
        
    const name = fomrData.get("name") as string
    const email = fomrData.get("email") as string
    const company = fomrData.get("company") as string
    const clientId = fomrData.get('clientId') as string
    

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
            company : company

        }
    })


    return {success : true, client}

    

    }catch(err) {

        console.log('error', err);
        

    }
}

export async function deleteClient(formData : FormData) {
    try {
        const clientId = formData.get('clientId') as string
    
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
    
        return {success : true}

    } catch (error) {

        console.log('error', error);
        
        
    }
}