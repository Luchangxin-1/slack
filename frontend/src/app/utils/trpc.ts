import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

export const fetchData = async (str: string) =>
  await serverClient.hello({ text: "str" });
