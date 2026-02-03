import { prisma } from "lib/prisma.js"

export type AllowProvider = {
    id: number
    provedor: string
}

export type IAllowProviderRepository = {
    add: (provider: string) => Promise<string | void>
    remove: (id: number) => Promise<string | void>
    findAll: () => Promise<AllowProvider[]>
}

export const AllowProviderRepository: IAllowProviderRepository = {
    add: async (provider) => {
        try {
            await prisma.allowProvider.create({
                data: {
                    provedor: provider
                }
            })
        } catch (error) {
            return "Error ao adicionar provedor"
        }
    },

    remove: async (id) => {
        try {
            await prisma.allowProvider.delete({
                where: {
                    id
                }
            })
        } catch (error) {
            return "Error ao remover provedor"
        }
    },

    findAll: async () => {
        try {
            return await prisma.allowProvider.findMany()
        } catch (error) {
            return []
        }
    }
}
