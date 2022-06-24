import Discord from 'discord.js';
import { plexMessage } from './messages/plexMessage';
const PlexAPI = require('plex-api');
const cron = require('node-cron');

export const plexConnect = async (bot: Discord.Client) => {

  // Connect to Puddingflix
  let plexClientPuddingflix = new PlexAPI({
    hostname: process.env.PUDDINGFLIX_IP,
    port: process.env.PUDDINGFLIX_PORT,
    token: process.env.PUDDINGFLIX_TOKEN,
    options: {
      identifier: process.env.PLEX_CLIENT_IDENTIFIER,
      deviceName: "PuddingBot",
      version: "0.4"
    }
  });

  // Connect to Duckflix
  let plexClientDuckflix = new PlexAPI({
    hostname: process.env.DUCKFLIX_IP,
    port: process.env.DUCKFLIX_PORT,
    token: process.env.DUCKFLIX_TOKEN,
    options: {
      identifier: process.env.PLEX_CLIENT_IDENTIFIER,
      deviceName: "PuddingBot",
      version: "0.4"
    }
  });
  
  let puddingflix: boolean = false;
  let duckflix: boolean = false;
  let puddingflixLastValue: boolean;
  let duckflixLastValue: boolean;

  const serversCheck = async () => {

    // Check if Puddingflix is online
    try {
      let result = await plexClientPuddingflix.query("/") 
      console.log("Plex Media Server '" + result.MediaContainer.friendlyName + "' is running, version " + result.MediaContainer.version);
      puddingflix = true;
    }
    catch (e) {
      puddingflix = false;
      console.error("Could not connect to Puddingflix");
    }

    // Check if Duckflix is online
    try {
      let result = await plexClientDuckflix.query("/") 
      console.log("Plex Media Server '" + result.MediaContainer.friendlyName + "' is running, version " + result.MediaContainer.version);
      duckflix = true;
    }
    catch (e) {
      duckflix = false;
      console.error("Could not connect to Duckflix");
    }

    // Do not send edit request if status has not changed
    if (puddingflix === puddingflixLastValue && duckflix === duckflixLastValue) {
      console.log("No plex status changes")
      return;
    }
    puddingflixLastValue = puddingflix;
    duckflixLastValue = duckflix;
    //console.log("Puddingflix online: " + puddingflix + "\nDuckflix online: " + duckflix);

    plexMessage(bot, [puddingflix, duckflix]);
  };

  serversCheck();

  // Run check every hour
  cron.schedule('0 * * * *', async () => {
    serversCheck();
  });
};
