import type { Message, TextChannel } from "discord.js";
import ctx from "../../util/ctx";

export function channelperms(message: Message): void | boolean {
  const Guildperms_ =  message.guild?.me?.permissions.has([
    'EMBED_LINKS', 'SEND_MESSAGES'
  ]);

  const ChannelPerms_ = (message.channel as TextChannel).permissionsFor(message.client.user?.id!)?.has([
    'EMBED_LINKS', 'SEND_MESSAGES'
  ]);
  
  if (!Guildperms_) {
    if (!ChannelPerms_) {
      return;
    }
    return true;
  }
  else {
    if (!ChannelPerms_) return;
  }
  return true;
}

export function voice_channelperms(message: Message): unknown {
  if (!message.member?.voice.channel?.permissionsFor(message.client.user?.id!)?.has('CONNECT')) {
    return ctx({
      key: 'errors.permissions.missing_connect_perms'
    }, message)
  }
  else if (!message.member?.voice.channel?.permissionsFor(message.client.user?.id!)?.has('SPEAK')) {
    return ctx({
      key: 'errors.permissions.missing_speak_perms'
    }, message);
  }
}

export function reactionperms(message: Message): void | boolean {

  const Guildperms_ =  message.guild?.me?.permissions.has(['ADD_REACTIONS']);

  const ChannelPerms_ = (message.channel as TextChannel).permissionsFor(message.client.user?.id!)?.has(['ADD_REACTIONS']);
  
  if (!Guildperms_) {
    if (!ChannelPerms_) {
      return;
    }
    return true;
  }
  else {
    if (!ChannelPerms_) return;
  }
  return true;
}