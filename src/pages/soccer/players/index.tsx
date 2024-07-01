import { EPlayersReservedSlugs } from "@/constants/routing";
import { NextPageContext, Redirect } from "next";

const Players = () => (
  <>
    <h1>Players</h1>
  </>
);
export default Players;

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    redirect: {
      permanent: true,
      destination: `/soccer/players/${EPlayersReservedSlugs.topScorers}`,
    } as Redirect,
    props: {},
  };
};
