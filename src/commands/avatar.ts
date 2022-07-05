import { CommandDefinition } from "../CommandDefinition";
//import { MessageEmbed } from 'Discord.js';
const { MessageEmbed } = require("discord.js");
import { BOT_COLOR, Category } from "../constants";

export const avatar: CommandDefinition = {
  name: "avatar",
  description: "Displays a user's avatar",
  commandDisplay: "avatar <user>?",
  category: Category.UTIL,
  executor: async (msg) => {

    const user = msg.mentions.users.first() ||  msg.author;

    const avatarEmbed = new MessageEmbed({
      image: {
        url: user.displayAvatarURL({ dynamic: true, size: 4096 })
      },
      color: BOT_COLOR
    });

    if (user === msg.mentions.users.first())
      avatarEmbed.title = user.tag;
    else
      avatarEmbed.title = msg.author.tag;

    return msg.channel.send({ embeds: [avatarEmbed] });
  }
};