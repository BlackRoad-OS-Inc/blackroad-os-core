import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import type { AppRouter } from "../../../src/trpc/router";

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [] // TODO(core-next): wire gateway proxy
    };
  },
  ssr: false
});
