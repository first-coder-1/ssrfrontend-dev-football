// import React, { useEffect, useState } from "react";
// // import intl from 'react-intl-universal';
// // import { Helmet } from 'react-helmet';
// // import { useParams } from 'react-router';
// // import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
// import { observer } from "mobx-react-lite";
// import { makeStyles } from "tss-react/mui";
// import Box from "@mui/material/Box";
// import Tab from "@mui/material/Tab";
// import Grid from "@mui/material/Grid";
// import Hidden from "@mui/material/Hidden";
// import TabbedHeader from "../TabbedHeader";
// import FavoriteSwitch from "../FavoriteSwitch";
// import { useMst } from "../../store";
// import { slugify } from "../../utils";
// import TabContainer from "../TabContainer";
// import { getActiveLeagueSeason, getLeague, getLeagueSeasons, League, LeagueSeason } from "../../api";
// import { useActiveTab } from "@/utils/getActiveTab";
// import { league as leagueUrls } from "../../sitemap";
// import { SeasonSelect } from "./SeasonSelect";
// import { Stats } from "./Stats";
// import StageTables, { StageTable } from "../StageTables";
// import Summary from "./Summary";
// import Matches from "./Matches";
// import Standings from "./Standings";
// import Players from "./Players";
// import Transfers from "./Transfers";
// import Sidelined from "./Sidelined";
// import Trophies from "./Trophies";
// import Venues from "./Venues";
// import LeagueImage from "../LeagueImage";
// import PlaceholderPage from "../PlaceholderPage";
// import PlaceholderList from "../PlaceholderList";
// import HeaderBox from "../HeaderBox";
// import DefaultHead from "../DefaultHead";
// import NotifiableSwitch from "../NotifiableSwitch";

// const useStyles = makeStyles()((theme) => ({
//   mobileOnly: {
//     [theme.breakpoints.up("md")]: {
//       display: "none",
//     },
//   },

//   tab: {
//     minWidth: 120,
//   },
// }));

// export function LeaguePage(): React.ReactElement | null {
//   const { classes } = useStyles();
//   const { auth, favorites, settings } = useMst();
//   // const { id } = useParams();

//   const [loading, setLoading] = useState(false);
//   const [seasons, setSeasons] = useState<LeagueSeason[]>([]);
//   const [league, setLeague] = useState<League | undefined | null>();
//   const [activeSeason, setActiveSeason] = useState<LeagueSeason>();

//   useEffect(() => {
//     const leagueId = parseInt(id!, 10);
//     const [getLeagueFetch, getLeagueCancel] = getLeague(leagueId);
//     const [getLeagueSeasonsFetch, getLeagueSeasonsCancel] = getLeagueSeasons(leagueId);

//     Promise.all([getLeagueFetch, getLeagueSeasonsFetch])
//       .then(([leagueResponse, seasonsResponse]) => {
//         const leagueData = leagueResponse.data;
//         const seasonsData = seasonsResponse.data;
//         setLeague(leagueData);
//         setSeasons(seasonsData);
//         setActiveSeason(getActiveLeagueSeason(seasonsData, leagueData.current_season_id));
//         setLoading(false);
//       })
//       .catch(() => {
//         setLeague(null);
//         setSeasons([]);
//         setLoading(false);
//       });

//     return () => {
//       getLeagueCancel();
//       getLeagueSeasonsCancel();
//     };
//   }, [id]);

//   const active = useActiveTab(leagueUrls);

//   if (loading) {
//     return <PlaceholderPage tabFooter={<PlaceholderList size={36} length={1} className={classes.mobileOnly} />} />;
//   }

//   if (league === null || league === undefined) {
//     return <Navigate to="../../../404" />;
//   }

//   const leagueTitleData = {
//     name: (!settings.originalNames && league.name_loc) || league.name,
//     country: league.country_iso2 ? `(${intl.get(`countries.${league.country_iso2}`)}) ` : ``,
//   };

//   return (
//     <>
//       <DefaultHead params={{ name: slugify(league.name) }} />

//       <TabbedHeader
//         header={
//           <>
//             <LeagueImage
//               url={league?.logo_path}
//               name={(!settings.originalNames && league?.name_loc) || league?.name}
//               variant="28x"
//             />
//             <HeaderBox item={league} />
//             <FavoriteSwitch
//               checked={favorites.leagues.has(league._id)}
//               onChange={(e) => {
//                 e.stopPropagation();
//                 if (favorites.leagues.has(league._id)) {
//                   favorites.removeFavoriteLeague(league._id);
//                 } else {
//                   favorites.addFavoriteLeague(league._id);
//                 }
//               }}
//             />
//             <NotifiableSwitch
//               checked={favorites.notifiableLeagues.has(league._id)}
//               isLoggedIn={!!auth.user}
//               onChange={(e) => {
//                 e.stopPropagation();
//                 if (favorites.notifiableLeagues.has(league._id)) {
//                   favorites.removeNotifiableLeague(league._id);
//                 } else {
//                   favorites.addNotifiableLeague(league._id);
//                 }
//               }}
//             />
//           </>
//         }
//         footer={
//           <Box className={classes.mobileOnly}>
//             <SeasonSelect activeSeason={activeSeason} setActiveSeason={setActiveSeason} seasons={seasons} />
//           </Box>
//         }
//         active={active}
//       >
//         <Tab label={intl.get(`leagues.summary`)} value={0} component={NavLink} to="summary" className={classes.tab} />
//         <Tab label={intl.get(`leagues.matches`)} value={1} component={NavLink} to="matches" className={classes.tab} />
//         {activeSeason && activeSeason.has_standings && (
//           <Tab label={intl.get(`leagues.tables`)} value={2} component={NavLink} to="tables" className={classes.tab} />
//         )}
//         {activeSeason &&
//           (activeSeason.has_topscorers || activeSeason.has_assistscorers || activeSeason.has_cardscorers) && (
//             <Tab
//               label={intl.get(`leagues.players`)}
//               value={3}
//               component={NavLink}
//               to="players"
//               className={classes.tab}
//             />
//           )}
//         {league.has_transfers && !league.is_cup && (
//           <Tab
//             label={intl.get(`leagues.transfers`)}
//             value={4}
//             component={NavLink}
//             to="transfers"
//             className={classes.tab}
//           />
//         )}
//         {league.has_sidelined && (
//           <Tab
//             label={intl.get(`leagues.sidelined`)}
//             value={5}
//             component={NavLink}
//             to="sidelined"
//             className={classes.tab}
//           />
//         )}
//         {league.has_trophies && !league.is_cup && (
//           <Tab
//             label={intl.get(`leagues.trophies`)}
//             value={6}
//             component={NavLink}
//             to="trophies"
//             className={classes.tab}
//           />
//         )}
//         {league.has_venues && !league.is_cup && (
//           <Tab label={intl.get(`leagues.venues`)} value={7} component={NavLink} to="venues" className={classes.tab} />
//         )}
//         <TabContainer grow />
//         <TabContainer
//           label={<SeasonSelect activeSeason={activeSeason} setActiveSeason={setActiveSeason} seasons={seasons} />}
//         />
//       </TabbedHeader>

//       <Grid container spacing={4}>
//         <Grid item xs={12} lg={9}>
//           <Box sx={{ mt: 4 }}>
// {/* children */}
//           </Box>
//         </Grid>
//         <Grid item xs={12} lg={3}>
//           <Hidden only={["sm", "md"]}>
//             <StageTables stageId={activeSeason?.stage_id}>
//               {(standings, legend) => (
//                 <Box sx={{ mt: { xs: 0, md: 4 } }}>
//                   <StageTable standings={standings} legend={legend} count={10} />
//                 </Box>
//               )}
//             </StageTables>
//           </Hidden>
//           <Hidden lgDown>
//             <Box sx={{ mt: 4 }}>
//               <Stats league={league} />
//             </Box>
//           </Hidden>
//         </Grid>
//       </Grid>
//     </>
//   );
// }

// export default observer(LeaguePage);
