import React from "react";
import SocialLogin from "react-social-login";

type Props = {
  triggerLogin: () => void;
};

export function SocialButton(props: React.PropsWithChildren<Props>): React.ReactElement {
  const { children, triggerLogin, ...rest } = props;
  return (
    <div onClick={triggerLogin} {...rest}>
      {children}
    </div>
  );
}

export default SocialLogin(SocialButton);
