import React, { useEffect } from "react";
// import intl from 'react-intl-universal';
import { observer } from "mobx-react-lite";
import { AuthStore } from "../../store/AuthStore";
import { BaseTemplate } from "./BaseTemplate";
import { Alert, AlertSeverity } from "../../models/Alert";
import { useIntl } from "@/hooks/useIntl";
import { useNavigate } from "@/hooks/useNavigate";
import { useRouter } from "next/router";

type Props = {
  auth: AuthStore;
};

export const Confirm = observer(function (props: Props): React.ReactElement {
  const intl = useIntl();
  const { auth } = props;
  const { locale, query } = useRouter();
  const token = query[1] as string;
  const navigate = useNavigate();

  useEffect(() => {
    auth.setLastError(undefined);
    auth.confirm({ token: token! }).then(() => {
      auth.root.alerts.addAlert(new Alert(intl.get("auth.confirmed"), AlertSeverity.success));
      navigate(`/auth/login`);
    });
  }, [auth, token, locale, navigate]);

  return (
    <BaseTemplate title={intl.get("auth.confirm")} lastError={auth.lastError} onSubmit={() => undefined}>
      &nbsp;
    </BaseTemplate>
  );
});
