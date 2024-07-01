import React, { useMemo } from "react";

import { styled, Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import useMediaQuery from "@mui/material/useMediaQuery";
import usePagination from "@mui/material/usePagination";
import PaginationItem, { PaginationItemProps } from "@mui/material/PaginationItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { pageNumber } from "@/utils/pagination";
import { useIntl } from "@/hooks/useIntl";

const StyledPaginationItem = styled(PaginationItem)<PaginationItemProps>(({ theme }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[200] : theme.palette.grey[600],
  "&.Mui-selected, &.Mui-selected:hover": {
    color: theme.palette.mode === "dark" ? theme.palette.grey[50] : theme.palette.grey[800],
    backgroundColor: "transparent",
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

type Props = {
  pageMin: number;
  pageMax: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  reduced?: boolean;
};

export function Pagination(props: Props): React.ReactElement | null {
  const { pageMin, pageMax, currentPage, onPageChange, className, reduced } = props;

  const intl = useIntl();

  const useStyles = makeStyles<{ reduced?: boolean }>()((theme, { reduced }) => {
    const nextButton = {
      marginRight: theme.spacing(1.5),
      height: theme.spacing(2),
      content: `"${intl.get("next")}"`,
    };
    const prevButton = {
      marginLeft: theme.spacing(1.5),
      height: theme.spacing(2),
      content: `"${intl.get("prev")}"`,
    };
    return {
      root: {
        display: "flex",
        alignItems: "center",
        justifyContent: reduced ? "space-evenly" : "space-between",
        padding: theme.spacing(1),
        width: "100%",
      },
      pages: {
        display: "flex",
        justifyContent: "center",
      },
      prev: {
        "&:after": {
          [theme.breakpoints.up("md")]: {
            ...prevButton,
          },
        },
      },
      next: {
        "&:before": {
          [theme.breakpoints.up("md")]: {
            ...nextButton,
          },
        },
      },
      prevReduced: {
        "&:after": {
          ...prevButton,
        },
      },
      nextReduced: {
        "&:before": {
          ...nextButton,
        },
      },
      ellipsis: {
        width: theme.spacing(4),
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      },
    };
  });

  const { classes, cx } = useStyles({ reduced });
  const pages = useMemo(() => {
    const pages = [1];
    for (let i = -pageMin; i <= pageMax; i++) {
      if (i < -1 || i > 1) {
        pages.push(i);
      }
    }

    return pages.sort((a, b) => a - b);
  }, [pageMin, pageMax]);
  const firstPage = pages[0];
  const lastPage = pages[pages.length - 1];
  const { items } = usePagination({
    count: pageMax + Math.max(0, pageMin - 1),
    page: pageNumber(firstPage, currentPage),
    hideNextButton: true,
    hidePrevButton: true,
  });
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  if (pages.length <= 1) {
    return null;
  }
  return (
    <Box className={cx(classes.root, className)}>
      {(!isMobile || items.length < 7) && (
        <StyledPaginationItem
          page={firstPage}
          onClick={() => onPageChange(pages[pages.indexOf(currentPage) - 1])}
          type="previous"
          disabled={currentPage <= firstPage}
          className={cx({
            [classes.prev]: !reduced,
            [classes.prevReduced]: reduced,
          })}
        />
      )}
      {!reduced && (
        <Box className={classes.pages}>
          {items.map((item) => {
            if (["start-ellipsis", "end-ellipsis"].includes(item.type)) {
              return (
                <Box key={item.type} className={classes.ellipsis}>
                  <Typography key={item.type}>...</Typography>
                </Box>
              );
            }
            const page = pages[item.page !== null ? item.page - 1 : 0];
            return (
              <StyledPaginationItem
                key={item.page}
                page={pageNumber(firstPage, page)}
                onClick={() => onPageChange(page)}
                selected={currentPage === page}
              />
            );
          })}
        </Box>
      )}
      {(!isMobile || items.length < 7) && (
        <StyledPaginationItem
          page={lastPage}
          onClick={() => onPageChange(pages[pages.indexOf(currentPage) + 1])}
          type="next"
          disabled={currentPage >= lastPage}
          className={cx({
            [classes.next]: !reduced,
            [classes.nextReduced]: reduced,
          })}
        />
      )}
    </Box>
  );
}

export default Pagination;
