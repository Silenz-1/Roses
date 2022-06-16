import il8next, { StringMap, TOptions } from 'i18next';
import type { Message, ColorResolvable } from 'discord.js';
//import { APIEmbed } from 'discord-api-types/v10'

type il8 = {
  key: string;
  options?: string | TOptions<StringMap>;
  isEmbed?: boolean;
};

export default async function ctx(
  ctx: il8,
  message: Message,
  color: ColorResolvable = 'RED'
): Promise<Message> {
  if (ctx.isEmbed === undefined || ctx.isEmbed) {
    return await message.channel.send({
      embeds: [
        {
          description: `${il8next.t(ctx.key, ctx.options)}`,
          color: color,
        },
      ],
    });
  }

  return await message.channel.send(`${il8next.t(ctx.key, ctx.options)}`);
}
