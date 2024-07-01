import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

type Props = {
  size: number,
}

export function PlaceholderGrid(props: Props): React.ReactElement {
  const { size } = props;
  return (
    <Grid container spacing={4}>
      {[...Array(6).keys()].map((val) => (
        <Grid item xs={12} md={6} key={`skeleton_${val}`}>
          <Card style={{ height: size }}>
            <CardHeader>
              <Skeleton width="60%" height={`${size * 0.05}px`} animation="wave"/>
            </CardHeader>
            <CardContent>
              <Skeleton width="100%" height={`${size * 0.4}px`} animation="wave"/>
            </CardContent>
            <CardMedia>
              <Skeleton width="80%" height={`${size * 0.1}px`} animation="wave"/>
              <Skeleton width="50%" height={`${size * 0.1}px`} animation="wave"/>
            </CardMedia>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default PlaceholderGrid;
