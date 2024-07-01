import { EPlayersReservedRoutes, EPlayersReservedSlugs } from "@/constants/routing";
import { NextPageContext, Redirect } from "next";

const PlayerMatches: React.FC = () => {
  return (
    <div>
      <h2>PlayerSlugs</h2>
    </div>
  );
};

export default PlayerMatches;

export const getServerSideProps = async (ctx: NextPageContext) => {
  const reservedSlugs = [
    EPlayersReservedSlugs.abroad,
    EPlayersReservedSlugs.bornToday,
    EPlayersReservedSlugs.cardScorers,
    EPlayersReservedSlugs.topScorers,
  ] as string[];
  const reservedEndRoutes = [EPlayersReservedRoutes.summary, EPlayersReservedRoutes.matches] as string[];

  const [playerName, playerId, endRoute, ...extraSlugs] = ctx.query.playerSlugs as string[];

  const reservedSlug = reservedSlugs.find((s) => s === playerName);
  if (reservedSlug) {
    return {
      redirect: {
        destination: `/soccer/players/${reservedSlug}`,
        permanent: true,
      } as Redirect,
      props: {},
    };
  }

  if (!reservedSlug && !playerId) {
    return {
      redirect: {
        destination: `/soccer/players/${EPlayersReservedSlugs.topScorers}`,
        permanent: true,
      } as Redirect,
      props: {},
    };
  }

  const hasEndRoute = reservedEndRoutes.includes(endRoute);
  if (!hasEndRoute) {
    return {
      redirect: {
        destination: `/soccer/players/${playerName}/${playerId}/${EPlayersReservedRoutes.summary}`,
        permanent: true,
      } as Redirect,
      props: {},
    };
  }
  if (endRoute && extraSlugs?.length) {
    return {
      redirect: {
        destination: `/soccer/players/${playerName}/${playerId}/${endRoute}`,
        permanent: true,
      } as Redirect,
      props: {},
    };
  }

  return {
    props: {
      playerName,
      playerId,
      endRoute,
    },
  };
};
