import { prisma } from "lib/prisma.js"

export type AllowProvider = {
    id: number
    provedor: string
}

export type IAllowProviderRepository = {
    add: (provider: string) => Promise<AllowProvider>
    remove: (id: number) => Promise<AllowProvider>
    findAll: () => Promise<AllowProvider[]>
}

export const AllowProviderRepository: IAllowProviderRepository = {
    async add(provider) {
        try {
            return await prisma.allowProvider.create({
                data: { provedor: provider }
            })
        } catch (error) {
            throw new Error("Erro ao adicionar provedor")
        }
    },

    async remove(id) {
        try {
            return await prisma.allowProvider.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error("Provedor não encontrado ou erro ao remover")
        }
    },

    async findAll() {
        try {
            return await prisma.allowProvider.findMany()
        } catch (error) {
            throw new Error("Erro ao buscar provedores")
        }
    }
}
