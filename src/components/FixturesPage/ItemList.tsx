import React, { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { observe } from "mobx";
import { AutoSizer, List, ListRowRenderer } from "react-virtualized";
import { RenderedRows } from "react-virtualized/dist/es/List";
import { makeStyles } from "tss-react/mui";
import { FixtureLeagueModel } from "../../models/FixtureLeagueModel";
import { useMst } from "@/store";

const useStyles = makeStyles()((theme) => ({
  root: theme.scrollbar as {},
}));

type Props = {
  leagues: FixtureLeagueModel[];
  subItemSize: number;
  children: (leagues: FixtureLeagueModel[]) => ListRowRenderer;
  onRowsRendered?: ((info: RenderedRows) => void) | undefined;
};

const itemSize = 64;

export const ItemList = observer<Props, List>(
  React.forwardRef(function ItemListFnc (props, setRef): React.ReactElement {
    const {
      intermediate: { openedCount },
    } = useMst();
    const { classes, cx } = useStyles();
    const { leagues, subItemSize, children, onRowsRendered } = props;
    const listRef = useRef<List | null>(null);

    useEffect(() => {
      const disposers = leagues.map((league) =>
        observe(league, (change) => {
          const index = leagues.indexOf(change.object);
          if (index !== -1) {
            listRef.current?.recomputeRowHeights(index);
          }
        })
      );
      return () => disposers.forEach((disposer) => disposer());
    }, [leagues, listRef]);

    useEffect(() => listRef.current?.recomputeRowHeights(0), [subItemSize, leagues, listRef.current, openedCount]);

    const rowRenderer = useMemo(() => children(leagues), [children, leagues]);

    return (
      <AutoSizer defaultHeight={640}>
        {({ height, width }) => (
          <>
            <List
              ref={(ref) => {
                listRef.current = ref;
                if (typeof setRef === "function") {
                  setRef(ref);
                }
              }}
              height={height}
              rowCount={leagues.length}
              estimatedRowSize={itemSize}
              rowHeight={({ index: i }) => {
                return leagues[i].open ? itemSize + leagues[i].league.fixtures.length * subItemSize : itemSize;
              }}
              rowRenderer={rowRenderer}
              onRowsRendered={onRowsRendered}
              width={width}
              className={cx("MuiList-root", classes.root)}
            />
          </>
        )}
      </AutoSizer>
    );
  })
);
