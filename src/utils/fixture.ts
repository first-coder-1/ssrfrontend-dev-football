import { FixtureStatus } from "@/api";

export function isLive(status: FixtureStatus) {
  return [
    FixtureStatus.LIVE,
    FixtureStatus.HT,
    FixtureStatus.ET,
    FixtureStatus.PEN_LIVE,
    FixtureStatus.BREAK,
  ].includes(status);
}

export function isFinished(status: FixtureStatus) {
  return [
    FixtureStatus.FT,
    FixtureStatus.FT_PEN,
    FixtureStatus.AET,
    FixtureStatus.INT,
    FixtureStatus.AWARDED,
  ].includes(status);
}

export function isCancelled(status: FixtureStatus) {
  return [FixtureStatus.CANCL].includes(status);
}

export function isPostponed(status: FixtureStatus) {
  return [FixtureStatus.POSTP].includes(status);
}

export function isScheduled(status: FixtureStatus) {
  return [
    FixtureStatus.NS,
    FixtureStatus.ABAN,
    FixtureStatus.SUSP,
    FixtureStatus.DELAYED,
    FixtureStatus.TBA,
  ].includes(status);
}

export function isPenalty(status: FixtureStatus) {
  return [FixtureStatus.PEN_LIVE, FixtureStatus.FT_PEN].includes(status);
}

export function isLiveOrScheduled(status: FixtureStatus) {
  return isLive(status) || isScheduled(status);
}
