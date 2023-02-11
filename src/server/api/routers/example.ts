import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

let user = {
  firstName: "Abdul",
  lastName: "Shabbir",
  email: "abdulqshabbir@gmail.com"
}

export const exampleRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string().optional(),
      email: z.string().email()
    }))
    .query(({ input }) => {
      user.firstName = input.firstName
      if (input.lastName) {
        user.lastName = input.lastName
      }
      user.email = input.email
      return user
    }),

  setUser: publicProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string()
    }))
    .mutation(({ input }) => {
      user = {
        ...input
      }

      return user
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
