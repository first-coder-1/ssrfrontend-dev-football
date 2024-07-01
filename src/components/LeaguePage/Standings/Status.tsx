import React from 'react';

type Props = {
  up?: boolean,
}

export function Status(props: Props): React.ReactElement {
  const { up } = props;
  if (up) {
    return (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 0L9.33013 7.5H0.669873L5 0Z" fill="#67C480"/>
      </svg>
    );
  }
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 8L0.669872 0.5L9.33013 0.5L5 8Z" fill="#FC7C5F"/>
    </svg>
  );
}
