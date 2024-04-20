import * as boom from "@hapi/boom";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { MenuService } from "./menu.service";
import { config } from "../config/config";

const menuService = new MenuService();

export class AuthService {
  constructor() {}

  async getMenuByKey(key: string) {
    const menus = await menuService.find();
    for (const menu of menus) {
      const isMatch = await bcrypt.compare(key, menu.code);
      if (isMatch) {
        return menu;
      }
    }

    throw boom.unauthorized();
  }

  signToken(menu: any) {
    const payload = {
      sub: menu.id,
    };
    const { jwtSecret } = config;
    const { code, ...menuReturned } = menu;
    const access_token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    return {
      menu: menuReturned,
      token: { access_token },
    };
  }
}
