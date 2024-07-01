import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import { BookmakerShort, getBookmakers } from "@/api";
import Select from "@/components/Select";
import { useMst } from "@/store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

export const BookmakerSelect = observer(() => {
  const { settings } = useMst();
  const intl = useIntl();
  const bookmakerId = settings.bookmaker;

  const [bookmakers, setBookmakers] = useState<BookmakerShort[]>([]);

  useEffect(() => {
    const [promise, cancel] = getBookmakers();

    Promise.all([promise, settings.fetchBookmaker()]).then(
      ([res]) => setBookmakers(res.data),
      () => setBookmakers([])
    );

    return cancel;
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <Select
      label={
        bookmakers.find((bookmaker) => bookmaker._id === bookmakerId)?.name ||
        intl.get("settings.choose-bookmaker")
      }
    >
      {(onClose) =>
        bookmakers.map((bookmaker) => (
          <MenuItem
            key={bookmaker._id}
            selected={bookmaker._id === bookmakerId}
            onClick={() => {
              settings.changeBookmaker(bookmaker._id, true);
              onClose();
            }}
          >
            <ListItemText primary={bookmaker.name} />
          </MenuItem>
        ))
      }
    </Select>
  );
});
