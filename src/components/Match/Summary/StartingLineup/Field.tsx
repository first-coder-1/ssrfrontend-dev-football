import React from "react";
import field from "./field.svg";
import Image from "next/image";
import { makeStyles } from "tss-react/mui";

export function Field(): React.ReactElement {
  const fieldStyles = {
    width: "100%",
    height: "auto",
  };

  return <Image style={fieldStyles} src={field} alt="Field" />;
}
