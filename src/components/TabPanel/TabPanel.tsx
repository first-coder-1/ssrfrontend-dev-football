import React from 'react';

type Props = {
  index: number | string,
  value: number | string,
}

export function TabPanel(props: React.PropsWithChildren<Props>) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  );
}

export default TabPanel;
