import { NextPageContext, Redirect } from "next";

const Teams = () => (
  <>
    <h1>Teams</h1>
  </>
);
export default Teams;

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    redirect: {
      permanent: true,
      destination: `/soccer/teams/domestic`,
    } as Redirect,
    props: {},
  };
};
