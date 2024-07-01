import React, { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { observe } from "mobx";
import { AutoSizer, List, ListRowRenderer } from "react-virtualized";
import { RenderedRows } from "react-virtualized/dist/es/List";
import { makeStyles } from "tss-react/mui";
import { useMst } from "@/store";
import { FixtureLeague } from "@/api";

const useStyles = makeStyles()((theme) => ({
  root: theme.scrollbar as {},
}));

type Props = {
  leagues: FixtureLeague[];
  subItemSize: number;
  children: (leagues: FixtureLeague[]) => ListRowRenderer;
  onRowsRendered?: ((info: RenderedRows) => void) | undefined;
};

const itemSize = 64;

export const ItemListSSR = observer<Props, List>(
  React.forwardRef(function ItemListSSRFnc (props, setRef): React.ReactElement {
    const { classes, cx } = useStyles();
    const { leagues, subItemSize, children, onRowsRendered } = props;
    const listRef = useRef<List | null>(null);

    const rowRenderer = children(leagues);

    return (
      <AutoSizer defaultHeight={640} defaultWidth={1000}>
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
                return leagues[i].live ? itemSize + leagues[i].fixtures.length * subItemSize : itemSize;
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
