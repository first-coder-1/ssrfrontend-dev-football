import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../store';
import { dateTz } from '../../utils/dateTz';

type Props = {
  children: number | Date,
}

export function DateTz(props: Props): React.ReactElement {
  const { settings: { timeZone }} = useMst();
  return (
    <>
      {dateTz(props.children, timeZone)}
    </>
  );
}

export default observer(DateTz);
