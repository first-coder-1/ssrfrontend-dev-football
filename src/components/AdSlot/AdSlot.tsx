import React, { useMemo } from "react";
import { Size } from "react-dfp";
import DFPAdSlot from "react-dfp/lib/adslot";

interface IProps {
  id: string;
  size: Size[];
}

// const DFPAdSlot = React.lazy(() => import("react-dfp/lib/adslot"));
function AdSlot({ id, size }: IProps): React.ReactElement {
  const sizes = useMemo(() => size, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <DFPAdSlot slotId={id} adUnit={id} sizes={sizes} />;
}

export default AdSlot;
