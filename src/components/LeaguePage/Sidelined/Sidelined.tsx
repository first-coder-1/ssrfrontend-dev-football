import React, { useEffect, useState } from "react";
// import intl from 'react-intl-universal';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import {
  getSidelinedBySeasonAndYear,
  getTeamsBySeasonId,
  League,
  LeagueSeason,
  LeagueSidelined as SidelinedType,
  pageCount,
  SeasonTeam,
} from "../../../api";
import { useSeasonSidelinedYears } from "../../../hooks/useSeasonSidelinedYears";
import SidelinedTable from "../../../components/SidelinedTable";
import YearSelect from "../../../components/YearSelect";
import DoubleSelect from "../../../components/DoubleSelect";
import Pagination from "../../../components/Pagination";
import TeamSelect from "../TeamSelect";
import PlaceholderList from "../../../components/PlaceholderList";
import { useIntl } from "@/hooks/useIntl";
import { TSidelinedsRes } from "@/pages/soccer/leagues/[type]/[id]/sidelined";

type Props = {
  league: League;
  season?: LeagueSeason;
  sidelinedsRes: TSidelinedsRes;
};

export function Sidelined(props: Props): React.ReactElement {
  const intl = useIntl();
  const { season, sidelinedsRes } = props;
  const [years, year, setYear] = useSeasonSidelinedYears(season?._id);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(sidelinedsRes.pages);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<SeasonTeam[]>([]);

  useEffect(() => {
    if (season) {
      const [promise, cancel] = getTeamsBySeasonId(season._id, true);
      promise.then(
        (res) => setTeams(res.data),
        () => setTeams([])
      );
      return cancel;
    }
  }, [season]);

  const [team, setTeam] = useState<SeasonTeam | undefined>();

  useEffect(() => {
    setTeam(undefined);
  }, [teams]);

  const [sidelineds, setSidelineds] = useState<SidelinedType[]>(sidelinedsRes.sidelineds);

  useEffect(() => {
    if (season && year) {
      setLoading(true);
      const [promise, cancel] = getSidelinedBySeasonAndYear(season._id, year, page, team?._id);
      promise.then((res) => {
        setSidelineds(res.data.sidelined.filter((sidelined) => !!sidelined.player));
        setLastPage(pageCount(res));
        setLoading(false);
      });
      return cancel;
    }
  }, [season, year, page, team]);

  if (loading) {
    return (
      <Paper>
        <PlaceholderList size={50} />
      </Paper>
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title={intl.get("leagues.sidelined")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <DoubleSelect>
          {(containerClassName, leftClassName, rightClassName) => (
            <CardContent className={containerClassName}>
              <YearSelect years={years} year={year} setYear={setYear} className={leftClassName} />
              <TeamSelect teams={Array.from(teams.values())} team={team} setTeam={setTeam} className={rightClassName} />
            </CardContent>
          )}
        </DoubleSelect>
      </Card>

      <Card>
        <CardHeader
          title={intl.get("leagues.players")}
          titleTypographyProps={{
            variant: "h2",
          }}
        />
        <CardContent>
          <SidelinedTable sidelineds={sidelineds} page={page} />
          {lastPage > 1 && (
            <Box>
              <Pagination pageMin={1} pageMax={lastPage} currentPage={page} onPageChange={setPage} />
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default Sidelined;
