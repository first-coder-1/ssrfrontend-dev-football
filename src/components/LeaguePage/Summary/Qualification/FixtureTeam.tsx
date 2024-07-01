import React from 'react'
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import TeamImage from '../../../../components/TeamImage';

const useStyles = makeStyles()((theme) =>
  ({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    box: {
      display: 'flex',
      alignItems: 'center',
    },

    image: {
      height: theme.spacing(2),
    },

    score: {
      width: theme.spacing(2),
    },

    body1: theme.typography.body1 as {},
    body2: theme.typography.body2 as {}
  }));

type Props = {
  logoPath?: string,
  name: string,
  scores: number[],
  winner?: boolean,
}

export function FixtureTeam(props: Props): React.ReactElement {
  const { classes, cx } = useStyles();
  const { logoPath, name, scores, winner } = props;
  const className = cx({ [classes.body1]: winner, [classes.body2]: !winner })
  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <TeamImage url={logoPath} name={name} variant="22x22" className={classes.image}/>
        <Typography
          component="span"
          title={name}
          className={className}>
          {name}
        </Typography>
      </div>
      <div className={classes.box}>
        {scores.map((score, i) => (
          <Typography key={i} component="span" className={cx(className, classes.score)} align="center">{score}</Typography>
        ))}
      </div>
    </div>
  );
}
