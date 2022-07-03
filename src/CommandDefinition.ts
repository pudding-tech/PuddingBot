import Discord from "discord.js";
import { Category } from "./constants";

export interface CommandDefinition {
  name: string,
  description?: string,
  category: Category,
  commandDisplay?: string,
  requiredPermissions?: Discord.PermissionString[],
  executor: (msg: Discord.Message, client: Discord.Client) => Promise<unknown>
}