import Discord from "discord.js";
import { Player } from "discord-player";
import dotenv from "dotenv";
import { commands } from "./commands";
import { Category, CMD_PREFIX } from "./constants";
import { plexConnect } from "./plex";

dotenv.config();

const intents = new Discord.Intents(32767);
const bot = new Discord.Client({ intents });
//const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.GUILD_MESSAGES] });

bot.once("ready", () => {
  console.log(bot.user?.username + " sucessfully logged in!");

  // Set bot activity
  bot.user?.setPresence({
    status: "online",
    activities: [{
        name: ".help",
        type: "PLAYING"
    }]
  });

  // Connect to plex servers
  plexConnect(bot);
});

bot.on("disconnect", () => {
  console.log(bot.user?.username + " has logged out...");
});

// Listener for incoming messages
bot.on("messageCreate", async (msg) => {

  // Ignore bot messages
  if (msg.author.bot)
    return;

  // Check if command
  if (msg.content.startsWith(CMD_PREFIX)) {

    // Trim input to command only
    const cmdInput = msg.content.substring(CMD_PREFIX.length, msg.content.includes(" ") ? msg.content.indexOf(" ") : msg.content.length);
    
    const command = commands.find(cmd => cmd.name === cmdInput);
    
    if (command) {
      console.log(`Command "${command.name}" used by ${msg.author.tag}`);
      try {
        //if (command.category === Category.AUDIO) {
        await command.executor(msg, bot, player);
        //}
        //else {
          //await command.executor(msg, bot);
        //}
      }
      catch (e) {
        console.log("Error executing command");
        console.log(e);
      }
    }
    else {
      msg.reply("Command does not exist.\n" +
        "Use `.help` for a list of available commands.");
    }
  }
});

// Music player
const player = new Player(bot, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  }
});

// Login bot
bot.login(process.env.PUDDINGBOT_TOKEN);
