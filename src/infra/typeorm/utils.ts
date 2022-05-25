import { ObjectId } from "mongodb";

export const getObjectId = (id: string) => {
  return new ObjectId(id);
};
