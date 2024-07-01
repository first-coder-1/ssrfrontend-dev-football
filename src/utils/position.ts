import { useIntl } from "@/hooks/useIntl";
import { Position } from "../api";

export function getPositionById(positionId: Position, single?: boolean) {

  switch (positionId) {
    case Position.OTHER:
      return "teams.other"
    case Position.GOALKEEPER:
      return single ? "teams.goalkeeper" : "teams.goalkeepers";
    case Position.DEFENDER:
      return single ? "teams.defender" : "teams.defenders";
    case Position.MIDFIELD:
      return single ? "teams.midfielder" : "teams.midfielders";
    case Position.ATTACK:
      return single ? "teams.attacker" : "teams.attackers";
    case Position.COACH:
      return "teams.coach";
    default:
      return "";
  }
}
