import {
  Player,
  PlayerOptions,
  SearchResult,
  Track,
  UnresolvedTrack,
} from "erela.js";
import type { Message } from "discord.js";
import pm from "pretty-ms";
import { collector } from "../collectors/reactionCollector";
import ctx from "../ctx";

export default class Player_ extends Player {
  public filtredTracks: (Track | UnresolvedTrack)[];
  constructor(ops: PlayerOptions) {
    super(ops);
    this.filtredTracks = [];
  }

  public maxQueueNumber (message: Message, maxedQueueNo_: number): void {
    ctx(
      {
        key: "errors.track.queueMaxed",
        options: {
          length: maxedQueueNo_,
        },
      },
      message,
      "YELLOW"
    );
    if (this.queue.totalSize === 0) return this.destroy();
  };

  public maxPlaylist (query: SearchResult, message: Message, maxedQueueNo_: number): void {
    ctx(
      {
        key: "errors.playlist.queueMaxed",
        options: {
          playlistLength: query.tracks.length,
          length: maxedQueueNo_,
        },
      },
      message
    );
    if (this.queue.totalSize === 0) return this.destroy();
  };

  public maxtime (message: Message, maxedTime: number): void {
    ctx(
      {
        key: "errors.track.timeMaxed",
        options: {
          Time: pm(maxedTime),
        },
      },
      message
    );

    if (this.queue.totalSize === 0) return this.destroy();
  };

  public async maxTimePlaylist (
    tracks: (Track | UnresolvedTrack)[],
    query: SearchResult,
    maxedTime: number,
    message: Message
   
  ): Promise<void> {
    const on_time_tracks = tracks.filter((track) => track.duration! <= maxedTime);
    const off_time_tracks = tracks.filter(track => track.duration! >= maxedTime);
    this.filtredTracks = on_time_tracks;

    if (tracks.length === off_time_tracks.length) {
      ctx(
        {
          key: "errors.playlist.filtering_Maxed_Queue.unfilterable",
          options: {
            Time: pm(maxedTime),
            tracksLength: tracks.length,
            playlistName: query.playlist?.name
          },
        },
        message,
        "YELLOW"
      );
      return this.destroy();
    }

    const msg = await ctx(
      {
        key: "errors.playlist.filtering_Maxed_Queue.filter",
        options: {
          offTracks_Length: off_time_tracks.length,
          tracksLength: tracks.length,
          Time: pm(maxedTime),
        },
        isEmbed: false
      },
      message,
      "YELLOW"
    );
    return await collector(msg, ["✅", "❎"], message.author.id, this);
  };


  public progressBar(current: number, total: number, barSize: number, time: number) {
    /* 
      * Forked from 
    */
    const progress = Math.round((barSize * current) / total)
      time = Math.round(time / 1000);
      const s = time % 60,
        m = ~~((time / 60) % 60),
        h = ~~(time / 60 / 60);

      return {
        barProgress: '━'.repeat(progress > 0 ? progress-1 : progress) + '🔘' + '━'.repeat(barSize - progress),
        barTime: h === 0
          ? `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
          : `${String(Math.abs(h) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      }

  }
}
