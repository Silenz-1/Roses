import "reflect-metadata";
import { Client, Intents } from "discord.js";
import { Manager } from "erela.js";
import { URL, fileURLToPath, pathToFileURL } from "node:url";
import readdirp from "readdirp";
import { container } from "tsyringe";
import { Command, commandInfo } from "./config/Commands";
import type { Event } from "./config/Events";
import { tokens } from "./tokens.js";
import { InjCommands } from "./symbols";
import Spotify from "erela.js-spotify";
import i18next from "i18next";
import Backend from "i18next-fs-backend";

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

const manager = new Manager({
  nodes: [
    {
      //@ts-expect-error
      host: tokens.L_HOST,
      port: tokens.L_PORT,
      password: tokens.L_PASSWORD,
    },
  ],

  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },

  trackPartial: [
    "title",
    "uri",
    "requester",
    "duration",
    "identifier",
    "thumbnail",
    "displayThumbnail",
  ],

  plugins: [
    new Spotify({
      clientID: tokens.SP_CLIENTID!,
      clientSecret: tokens.SP_CLIENTSERCRET!,
    }),
  ],
});

const commands = new Map<string, Command>();

const commandFiles = readdirp(
  fileURLToPath(new URL("./commands", import.meta.url).href),
  {
    fileFilter: ["*.js"],
  }
);

const eventFiles = readdirp(
  fileURLToPath(new URL("./events", import.meta.url).href),
  {
    fileFilter: ["*.js"],
  }
);

container.register(InjCommands, { useValue: commands });
container.register(Manager, { useValue: manager });
container.register(Client, { useValue: client });

try {
  await i18next.use(Backend).init({
    fallbackLng: "en",
    defaultNS: "getText",
    lng: "en",
    ns: "getText",
    backend: {
      loadPath: fileURLToPath(
        new URL("../locales/{{lng}}/{{ns}}.json", import.meta.url)
      ),
    },
  });

  for await (const command_ of commandFiles) {
    const Cmd = commandInfo(command_.path);

    const command: Command = container.resolve(
      (await import(pathToFileURL(command_.fullPath).href)).default
    );

    const aliases = command.alias;

    commands.set(Cmd.commandName, command);
    for (const alias of aliases) {
      commands.set(alias, command);
    }
  }

  for await (const event_ of eventFiles) {
    const event: Event = container.resolve(
      (await import(pathToFileURL(event_.fullPath).href)).default
    );
    event.execute();
  }

  await client.login(tokens.botToken);
} catch (e) {
  console.log(e);
}
