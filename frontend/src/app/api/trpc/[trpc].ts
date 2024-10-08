// import * as trpcNext from "@trpc/server/adapters/next";
// import { appRouter } from "../../../server/routers/_app";
// // export API handler
// // @link https://trpc.io/docs/v11/server/adapters
// export default trpcNext.createNextApiHandler({
//   router: appRouter,
//   createContext: () => ({}),
// });

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/routers/_app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
