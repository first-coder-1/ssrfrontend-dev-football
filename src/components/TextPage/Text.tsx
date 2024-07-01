import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { getPage, Page } from "../../api";
import PlaceholderList from "../../components/PlaceholderList";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

const useStyles = makeStyles()((theme) => ({
  box: {
    ...(theme.typography.body1 as {}),
    "& a": {
      color: theme.palette.grey[theme.palette.mode === "dark" ? 100 : 800],
      textDecoration: "underline",
      "&:hover": {
        color: theme.palette.action.selected,
      },
    },
  },
}));

type Props = {
  pageId: string;
  pageContent: Page;
};

export function Text(props: Props): React.ReactElement | null {
  const { classes } = useStyles();
  const { pageId, pageContent } = props;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<Page | undefined>(pageContent);

  useEffectWithoutFirstRender(() => {
    setLoading(true);

    const [promise, cancel] = getPage(pageId);

    promise
      .then(
        (res) => {
          setPage(res.data);
        },
        () => setPage(undefined)
      )
      .finally(() => setLoading(false));
    return cancel;
  }, [pageId]);

  if (loading) {
    return (
      <Paper>
        <PlaceholderList size={40} />
      </Paper>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title={page.title}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <Box
          sx={{ pl: 3, pr: 3, pt: 2, pb: 2 }}
          className={classes.box}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </CardContent>
    </Card>
  );
}
