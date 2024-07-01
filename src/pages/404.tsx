import React, { FC, useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";
import Head from "next/head";

const useStyles = makeStyles()((theme) => ({
  content: {
    minHeight: theme.spacing(45),
  },
}));

const NotFoundPage: FC = () => {
  const router = useRouter();

  const { classes } = useStyles();
  const navigate = useNavigate();
  const intl = useIntl();
  const [isHistoryExists, setIsHistoryExists] = useState(false);

  useEffect(() => {
    setIsHistoryExists(window.history.length > 2);
  }, []);

  return (
    <Card>
      <Head>
        <title>Error 404 - {process.env.NEXT_PUBLIC_TITLE}</title>
      </Head>
      <CardHeader
        title={intl.get("not-found.title")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardMedia className={classes.content}>
        <Typography>{intl.get("not-found.text")}</Typography>
      </CardMedia>
      <CardActions>
        {isHistoryExists && (
          <Button variant="outlined" onClick={() => router.back()}>
            {intl.get("not-found.back")}
          </Button>
        )}
        <Button variant="outlined" onClick={() => navigate(`/fixtures/all`)}>
          {intl.get("not-found.homepage")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default NotFoundPage;

export const getStaticProps = getSSPWithT();
