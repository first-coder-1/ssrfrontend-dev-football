import React from "react";
// import intl from "react-intl-universal";
import { makeStyles } from "tss-react/mui";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { MyLeague, MyTeam } from "../../api";
import Asset from "../Asset";
import { slugify } from "../../utils";
import { useMst } from "../../store";
import { observer } from "mobx-react-lite";
import { useNavigate } from "@/hooks/useNavigate";
import { useIntl } from "@/hooks/useIntl";

const useStyles = makeStyles()((theme) => ({
  starredItem: {
    paddingLeft: theme.spacing(1.7),
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    cursor: "pointer",
  },

  logoContainer: {
    width: 22,
    display: "flex",
    justifyContent: "center",
  },

  name: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

type Favorite = MyLeague | MyTeam;

type Props = {
  items: Favorite[];
  utlTemplate: string;
  onClick: () => void;
};

export function FavoriteList(props: Props): React.ReactElement {
  const intl = useIntl();
  const { classes } = useStyles();
  const { settings } = useMst();
  const navigate = useNavigate();
  return (
    <>
      {props.items.map((item) => (
        <ListItem
          key={item._id}
          className={classes.starredItem}
          onClick={() => {
            navigate(props.utlTemplate.replace("%s", `${slugify(item.name)}/${item._id}/summary`.toString()));
            props.onClick();
          }}
          title={`${(!settings.originalNames && item.name_loc) || item.name}${
            item.country_iso2 ? ` (${intl.get(`countries.${item.country_iso2}`)})` : ""
          }`}
        >
          <ListItemIcon>
            <div className={classes.logoContainer}>
              <Asset
                src={item.logo_path}
                alt={(!settings.originalNames && item.name_loc) || item.name}
                variant="16x16"
              />
            </div>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1" className={classes.name}>
                {(!settings.originalNames && item.name_loc) || item.name}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </>
  );
}

export default observer(FavoriteList);
