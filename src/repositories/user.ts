import { prisma } from "lib/prisma.js"

type User = {
  email: string
  idDiscord: string
  ip: string
  asn: string
}

export type IUserRepository = {
  save: (user: User) => Promise<void>
}

export const UserRepository: IUserRepository = {
  save: async (user) => {
    try {
      await prisma.user.upsert({
        where: {
          idDiscord: user.idDiscord
        },
        update: {
          ip: user.ip,
          asn: user.asn,
          email: user.email
        },
        create: user
      })
    } catch (error) {
      console.log(error)
    }
  }
}