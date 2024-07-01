import React, { useEffect, useState } from "react";
import { Canceler } from "axios";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { Comment, Fixture, getFixtureComments } from "../../../api";
import ReplyIcon from "../../../components/icons/ReplyIcon";
import SoccerIcon from "../../../components/icons/SoccerIcon";
import Checkbox from "../../../components/Checkbox";
import { isLive } from "../../../utils";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  content: {
    maxHeight: theme.spacing(150),
    overflow: "auto",
    ...theme.scrollbar,
  },

  item: {
    minHeight: 50,
  },

  text: {
    textTransform: "uppercase",
  },

  label: {
    marginRight: 0,
  },

  substitute: {
    color: theme.palette.success.main,
    transform: "scaleX(-1)",
  },
}));

type Props = {
  fixture: Fixture;
  comments: Comment[];
};

export function Comments(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { classes } = useStyles();
  const { fixture, comments: initialComments } = props;
  const [important, setImportant] = useState(true);
  const [comments, setComments] = useState<Comment[] | undefined>(initialComments);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let canceler: Canceler = () => undefined;
    if (isLive(fixture.time.status) || comments === undefined) {
      timeout = setTimeout(
        () => {
          const [promise, cancel] = getFixtureComments(fixture._id);
          promise.then((res) => setComments(res.data.comments));
          canceler = cancel;
        },
        comments === undefined ? 0 : 60000
      );
    }

    return () => {
      clearTimeout(timeout);
      canceler();
    };
  }, [fixture, comments]);

  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title={intl.get("match.comments")}
        action={
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <FormControlLabel
              control={<Checkbox checked={important} onChange={() => setImportant(!important)} />}
              label={intl.get("match.important-only")}
              className={classes.label}
            />
          </Box>
        }
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent className={classes.content}>
        <List disablePadding>
          {comments
            .filter((comment) => !important || comment.important)
            .sort((a, b) => b.order - a.order)
            .map((comment, i) => (
              <ListItem key={comment.order} className={classes.item} divider>
                <ListItemIcon>
                  <Typography>{i === 0 ? "-" : `${comment.minute + (comment.extra_minute || 0)}'`}</Typography>
                </ListItemIcon>
                <ListItemAvatar>
                  <Box>
                    {comment.comment.substring(0, 14) === "Substitution -" && (
                      <ReplyIcon fontSize="small" className={classes.substitute} />
                    )}
                    {comment.goal && <SoccerIcon viewBox="0 0 16 16" color="secondary" fontSize="small" />}
                  </Box>
                </ListItemAvatar>
                <ListItemText primary={comment.comment} primaryTypographyProps={{ className: classes.text }} />
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );
}
