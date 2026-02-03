import { prisma } from "lib/prisma.js"

export type AllowProvider = {
    id: number
    provedor: string
}

export type IAllowProviderRepository = {
    add: (provider: string) => Promise<string>
    remove: (id: number) => Promise<string | void>
    findAll: () => Promise<AllowProvider[]>
}

export const AllowProviderRepository: IAllowProviderRepository = {
    add: async (provider) => {
        const providerExists = await prisma.allowProvider.findUnique({
            where: {
                provedor: provider
            }
        })
        if (providerExists) {
            return "provedor ja existe"
        }
        try {
            return await prisma.allowProvider.create({
                data: {
                    provedor: provider
                }
            })
        } catch (error) {
            console.log(error)
            return "Error ao adicionar provedor"
        }
    },

    remove: async (id) => {
        try {
            return await prisma.allowProvider.delete({
                where: {
                    id
                }
            })
        } catch (error) {
            console.log(error)
            return "Error ao remover provedor"
        }
    },

    findAll: async () => {
        try {
            return await prisma.allowProvider.findMany()
        } catch (error) {
            console.log(error)
            return []
        }
    }
}
