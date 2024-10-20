import { CreateMessageType } from "@/features/message/type";
import api from "./api";

const createMessage = async (data: CreateMessageType) => {
  const resp = await api.post("/channel/create_message", data);
  return resp.data;
};

export { createMessage };
