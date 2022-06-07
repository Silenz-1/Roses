import { config } from "dotenv";
config();

export const tokens = {
  botToken: process.env.BOT_TOKEN,

  L_HOST: process.env.L_HOST,
  L_PASSWORD: process.env.L_PASSWORD,
  //@ts-expect-error
  L_PORT: parseInt(process.env.L_PORT),

  DB_HOST: process.env.DB_HOST,
  DB_password: process.env.DB_PASSWORD,
  DB_name: process.env.DB_NAME,
  DB_user:process.env.DB_USER, 

  SP_CLIENTID: process.env.SPOTIFY_CLIENTID, 
  SP_CLIENTSERCRET: process.env.SPOTIFY_CLIENTSERCRET
};



