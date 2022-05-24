import jwt from "jsonwebtoken";

import { AppSettings } from "../../settings.ts/app.settings";

export const createToken = (data: any, expiresIn: number): string => {
  data.expiresIn = expiresIn;
  return jwt.sign(data, AppSettings.JWT_SECRET, {
    expiresIn: expiresIn
  });
};

export const verifyToken = (data: string) => {
  return jwt.verify(data, AppSettings.JWT_SECRET);
};
