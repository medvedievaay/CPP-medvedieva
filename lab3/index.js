import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { getUserFromAuthHeader } from "./auth.js";

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
  // Для кожного запиту визначаємо користувача за заголовком Authorization
  context: async ({ req }) => {
    const user = getUserFromAuthHeader(req.headers.authorization);
    return { user };
  },
});

console.log(`GraphQL API запущено за адресою: ${url}`);
