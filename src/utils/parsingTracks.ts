import type { Snowflake } from "discord.js";
import { Track, TrackUtils, UnresolvedTrack } from "erela.js";

export function parsingTracks( track: Track, requester: Snowflake ): Track | UnresolvedTrack {
  try {
    const ResolvedTrack_ = TrackUtils.build(
      {
        track: track.track,
        //@ts-expect-error
        info: {
          title: track.title,
          uri: track.uri,
          length: track.duration,
          identifier: track.identifier,
        },
      },
      `<@${requester}>`
    );

    const UnresolvedTrack_ = TrackUtils.buildUnresolved(
      {
        title: track.title,
        duration: track.duration,
      },
      `<@${requester}>`
    );

    if (TrackUtils.isTrack(track)) return ResolvedTrack_;

    return UnresolvedTrack_;

  } catch (e) {
    return track;
  }
}