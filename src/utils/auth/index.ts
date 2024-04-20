import passport from "passport";

import { customStrategy } from "./strategies/custom.strategy";
import { jwtStrategy } from "./strategies/jwt.strategy";
import { apiKeyStrategy } from "./strategies/apiKey.strategy";

export const initializeStrategies = () => {
    passport.use(customStrategy);
    passport.use(jwtStrategy);
    passport.use("api-key", apiKeyStrategy);
}
