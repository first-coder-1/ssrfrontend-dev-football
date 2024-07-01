import { useState } from "react";

export const useModal = () => {
  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };
  return {
    visible,
    show,
    close,
  };
};
