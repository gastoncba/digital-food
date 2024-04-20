import { Strategy, VerifiedCallback } from "passport-custom";

import { AuthService } from "../../../services/auth.service";

const authService = new AuthService();

export const customStrategy = new Strategy(async (req, done: VerifiedCallback) => {
  try {
    const { body } = req;
    const menu = await authService.getMenuByKey(body.key);
    done(null, menu);
  } catch (error) {
    done(error, false);
  }
});
