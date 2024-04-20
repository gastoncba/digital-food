import { Strategy, VerifiedCallback } from "passport-custom";
import * as boom from "@hapi/boom";

import { config } from "../../../config/config";

export const apiKeyStrategy = new Strategy(async (req, done: VerifiedCallback) => {
  try {
    const { headers } = req;
    const apiKey = headers["x-api-key"];
    if (apiKey === config.apiKey) {
      done(null, {});
    } else {
      throw boom.unauthorized("Necesita una api key para acceder a los menus");
    }
  } catch (error) {
    done(error, false);
  }
});
