import { NextPageContext, Redirect } from "next";

const Soccer = () => <></>;
export default Soccer;

export const getServerSideProps = ({ query, locale, pathname }: NextPageContext) => {
  return {
    redirect: {
      permanent: true,
      destination: `/${locale}/`,
    } as Redirect,
    props: {},
  };
};
