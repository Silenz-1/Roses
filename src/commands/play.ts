import type { Command } from "../config/Commands";
import type { Message } from "discord.js";
import type { Manager, Track, UnresolvedTrack } from "erela.js";
import { injectable } from "tsyringe";
import { voice_channelperms } from "../utils/functions/permissions/botperms.js";
import { formates } from "../utils/functions/formates.js";
import { GetMaxqueue } from "../structures/db_managing/setting_maxqueue.js";
import { parsingTracks } from "../utils/util/parsingTracks.js";
import { GetTrackTime } from "../structures/db_managing/setting_tracktime.js";
import ctx  from "../utils/util/ctx.js";
import Player_ from "../utils/extended/ExtendedPlayer.js";

@injectable()
export default class implements Command {
  public name = "play";
  public alias = ["p"];
  public description = `\`Usage:\` **-play [songname|songURL|playlist]** 
\`aliases:\` **${this.alias}**\n\n To add a [song|playlist] to the queue.`;
  constructor() {}

  public async execute(
    message: Message,
    args: string[],
    manager: Manager,
  ): Promise<unknown> {

    const { player: { DefaultEmbed_f1 } } = formates;
          
      if (!message.member!.voice.channel) {
        return ctx({
          key: 'errors.player.no_user_found',
        }, message)
      }

        if (voice_channelperms(message)) return;

          if (
            message.guild!.me!.voice.channelId &&
            message.member!.voice.channelId !== message.guild!.me!.voice.channelId
          ) {
            return ctx({
              key: 'errors.player.not_the_same_vc'
            }, message)
          }

          if (args.length !== 0) {

          const player = new Player_({
            guild: message.guildId!,
            voiceChannel: message.member?.voice.channelId!,
            textChannel: message.channelId
          })

        const searchquery = await manager.search(args.join(" "), `<@${message.author.id}>`);
   
            
          if (searchquery.loadType === "LOAD_FAILED") {
            return ctx({
              key: 'errors.track.unloadable_track',
            }, message)
          }

              if (searchquery.loadType === "NO_MATCHES") {
                return ctx({
                  key: 'errors.track.no_track'
                }, message, "YELLOW")
              }     
        
                const maxQueueNum_ = await GetMaxqueue(message.guildId);
                const maxTrackTime_ = await GetTrackTime(message.guildId);
                const Track_ = parsingTracks(searchquery.tracks[0], message.author.id);
                
                          if (searchquery.loadType === "TRACK_LOADED") {
                            
                            if (Track_.duration! > maxTrackTime_) {
                              return player.maxtime(message, maxTrackTime_);
                            }

                              if (player.queue.totalSize > maxQueueNum_) {
                                return player.maxQueueNumber(message, maxQueueNum_);
                              } 
                              
                                if (player.state !== "CONNECTED") player.connect();
                         
                                  player.queue.add(Track_);

                                    DefaultEmbed_f1(message, player, Track_);

                                      if (!player.playing && !player.paused && !player.queue.size)
                                        await player.play();
                          }

                              if (searchquery.loadType === "SEARCH_RESULT") {

                                if (Track_.duration! > maxTrackTime_) {
                                  return player.maxtime(message, maxTrackTime_);
                                }

                                  if (player.queue.totalSize > maxQueueNum_) {
                                    return player.maxQueueNumber(message, maxQueueNum_)
                                  } 
                            
                                    if (player.state !== "CONNECTED") player.connect();

                                    player.queue.add(Track_);

                                      DefaultEmbed_f1(message, player, Track_);

                                        if (!player.playing && !player.paused && !player.queue.size)
                                          await player.play();
                              }

                                if (searchquery.loadType === "PLAYLIST_LOADED") {
                                  const tracks_: (Track| UnresolvedTrack)[] = searchquery.tracks;
                                  const off_time_tracks = tracks_.filter(track => track.duration! >= maxTrackTime_);

                                  if (tracks_.length > maxQueueNum_) {                                
                                    return player.maxPlaylist(searchquery, message, maxQueueNum_);
                                  }

                                  if (off_time_tracks.length !== 0) {                                   
                                    return await player.maxTimePlaylist(tracks_, searchquery, maxTrackTime_, message)
                                  }

                                  if (player.state !== "CONNECTED") player.connect();
                                    player.queue.add(searchquery.tracks);

                                    await ctx({
                                      key: 'playlist.queuing_playlist',
                                      options: {
                                        playlistName: searchquery.playlist?.name,
                                        playlistLength: tracks_.length
                                      }
                                    }, message, "AQUA")

                                    if (
                                      !player.playing &&
                                      !player.paused &&
                                        player.queue.totalSize === searchquery.tracks.length
                                    ) {
                                      await player.play();
                                    }
                                }
    } else {
      message.channel.send({
        embeds: [
          {
            description: this.description,
            color: "AQUA",
          },
        ],
      });
    }
  }
}
