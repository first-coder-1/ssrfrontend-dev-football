import { NextPageContext, Redirect } from "next";
import { useRouter } from "next/router";
import React from "react";

const TeamPage = () => {

  return <></>;
};

export default TeamPage;

export const getServerSideProps = (ctx: NextPageContext) => {
  const { kind, id } = ctx.query;

  return {
    redirect: {
      permanent: true,
      destination: `${id}/summary`,
    } as Redirect,
    props: {},
  };
};
