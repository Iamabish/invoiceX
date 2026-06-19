"use server"

import prisma from "@/lib/prisma";

export async function getUser(){
    return prisma.user.findMany({})
}