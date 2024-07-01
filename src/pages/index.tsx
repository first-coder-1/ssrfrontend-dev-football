import { NextPageContext, Redirect } from "next";

const Home = () => (
  <>
    <h1>Home</h1>
  </>
);
export default Home;

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    redirect: {
      permanent: true,
      destination: `/fixtures/all`,
    } as Redirect,
    props: {},
  };
};
