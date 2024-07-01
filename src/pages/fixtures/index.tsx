import { NextPageContext, Redirect } from "next";

const Fixtures = () => (
  <>
    <h1>Home</h1>
  </>
);
export default Fixtures;

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    redirect: {
      permanent: true,
      destination: `/fixtures/all`,
    } as Redirect,
    props: {},
  };
};
