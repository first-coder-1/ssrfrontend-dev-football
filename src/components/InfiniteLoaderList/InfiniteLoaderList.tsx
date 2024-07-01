import { useEffect, useRef } from "react";
import { makeStyles } from "tss-react/mui";
import List from "@mui/material/List";

const useStyles = makeStyles()(() => ({
  root: {
    overflowY: "auto",
  },
}));

type Props = {
  onRowsRendered: (attrs: { startIndex: number; stopIndex: number }) => void;
  rowCount: number;
  perPage: number;
  className?: string;
};

function InfiniteLoaderList(props: React.PropsWithChildren<Props>) {
  const { classes, cx } = useStyles();
  const { onRowsRendered, rowCount, perPage, className, children } = props;
  const listRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    const el = listRef.current;
    const listener = () => {
      const delta = (el!.scrollTop + el!.offsetHeight) / el!.scrollHeight;
      const stopIndex = Math.ceil(rowCount * delta);
      onRowsRendered({
        startIndex: stopIndex - perPage / 2, // start index is not important here, take half of page size
        stopIndex: stopIndex,
      });
    };
    el?.addEventListener("scroll", listener);
    return () => {
      el?.removeEventListener("scroll", listener);
    };
  }, [onRowsRendered, rowCount, perPage]);
  return (
    <List ref={listRef} disablePadding className={cx(classes.root, className)}>
      {children}
    </List>
  );
}

export default InfiniteLoaderList;
