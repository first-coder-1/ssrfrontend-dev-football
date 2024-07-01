import React from "react";
// import intl from 'react-intl-universal';
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "../../../components/Select";
import { useIntl } from "@/hooks/useIntl";

export enum StandingVariant {
  OVERALL = "overall",
  HOME = "home",
  AWAY = "away",
}

const variants = [StandingVariant.OVERALL, StandingVariant.HOME, StandingVariant.AWAY];

type Props = {
  variant: StandingVariant;
  setVariant: (variant: StandingVariant) => void;
};

export function VariantSelect(props: Props): React.ReactElement {
  const intl = useIntl();
  return (
    <Select label={intl.get(`standing-variant.${props.variant}`)}>
      {(onClose) =>
        variants.map((variant) => (
          <MenuItem
            key={variant}
            selected={variant === props.variant}
            onClick={() => {
              props.setVariant(variant);
              onClose();
            }}
          >
            <ListItemText primary={intl.get(`standing-variant.${variant}`)} />
          </MenuItem>
        ))
      }
    </Select>
  );
}
