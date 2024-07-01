import { makeStyles } from "tss-react/mui";

export default makeStyles()((theme) => ({
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
  },

  image: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
    marginRight: theme.spacing(1),
  },

  list: {
    maxHeight: 432,
    [theme.breakpoints.down("md")]: {
      maxHeight: 384,
    },
    "& .MuiListItem-root": {
      minHeight: 50,
      "&:nth-of-type(even)": {
        backgroundColor:
          theme.palette.grey[theme.palette.mode === "dark" ? 600 : 50],
      },
    },
  },

  staticList: {
    maxHeight: 550,
    [theme.breakpoints.down("md")]: {
      maxHeight: 550,
    },
  },

  left: {
    [theme.breakpoints.down("md")]: {
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
      paddingBottom: theme.spacing(1),
    },
  },

  right: {
    [theme.breakpoints.down("md")]: {
      height: 30,
    },
  },
}));
