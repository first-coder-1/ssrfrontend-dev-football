import React, { useCallback, useEffect, useState } from "react";
//@TODO: resolve import problem
import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
// const InfiniteLoader: React.FC = ({...props}) => {
//   return (<></>)
// }
import { makeStyles } from "tss-react/mui";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import InfiniteLoaderList from "@/components/InfiniteLoaderList";
import PlaceholderList from "@/components/PlaceholderList";
import { CountryTeams, getTeams } from "@/api";
import TeamItem from "./TeamItem";
import { useEffectWithoutFirstRender } from "@/hooks/useEffectWOFirst";

const useStyles = makeStyles()((theme) => ({
  list: {
    height: 432,
    [theme.breakpoints.down("md")]: {
      height: 384,
    },
  },
}));

type Props = {
  national?: boolean;
  countryTeams: CountryTeams[];
};

export const PER_PAGE = 20;

export function TeamList({ national, countryTeams }: Props): React.ReactElement {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [countries, setCountries] = useState<CountryTeams[]>(countryTeams);

  const fetchData = useCallback(
    (startIndex: number) => {
      setLoading(true);
      const [promise, cancel] = getTeams(national, startIndex, PER_PAGE);
      promise
        .then(
          (res) => {
            setCountries((countries) => countries.concat(res.data));
            if (res.data.length < PER_PAGE) {
              setIsLastPage(true);
            }
          },
          () => setCountries([])
        )
        .finally(() => setLoading(false));
      return [promise, cancel] as const;
    },
    [national]
  );

  useEffectWithoutFirstRender(() => {
    setCountries([]);
    const [, cancel] = fetchData(0);
    return cancel;
  }, [fetchData]);

  if (countries.length === 0 && loading) {
    return <PlaceholderList size={48} />;
  }

  return (
    <InfiniteLoader
      isRowLoaded={({ index }) => !!countries[index]}
      loadMoreRows={
        isLastPage
          ? () => Promise.resolve(null)
          : ({ startIndex }) => {
              const [promise] = fetchData(startIndex);
              return promise;
            }
      }
      rowCount={countries.length + PER_PAGE}
      minimumBatchSize={PER_PAGE}
    >
      {({ onRowsRendered }) => (
        <InfiniteLoaderList
          onRowsRendered={onRowsRendered}
          rowCount={countries.length}
          perPage={PER_PAGE}
          className={classes.list}
        >
          {countries
            .filter((country) => country.teams.length > 0)
            .map((country) => (
              <TeamItem key={country._id || "other"} country={country} />
            ))}
          {loading && (
            <ListItem sx={{ justifyContent: "center" }}>
              <CircularProgress />
            </ListItem>
          )}
        </InfiniteLoaderList>
      )}
    </InfiniteLoader>
  );
}
