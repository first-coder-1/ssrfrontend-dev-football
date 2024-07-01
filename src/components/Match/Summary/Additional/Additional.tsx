import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AdditionalInfo, Fixture, getFixtureAdditionalInfo } from "../../../../api";
import { Row } from "./Row";
import { useMst } from "../../../../store";
import { observer } from "mobx-react-lite";
import { useIntl } from "@/hooks/useIntl";

type Props = {
  fixture: Fixture;
  fixtureAddInfo: AdditionalInfo | undefined;
};

const attributes = ["referee", "firstAssistant", "secondAssistant", "fourthOfficial"] as (keyof AdditionalInfo)[];

export function Additional(props: Props): React.ReactElement | null {
  const intl = useIntl();
  const { fixture, fixtureAddInfo } = props;
  const { settings } = useMst();
  const [additional, setAdditional] = useState<AdditionalInfo | undefined>(fixtureAddInfo);

  useEffect(() => {
    const [promise, cancel] = getFixtureAdditionalInfo(fixture._id);
    promise.then((res) => setAdditional(res.data));
    return cancel;
  }, [fixture]);

  if (!additional || attributes.every((prop) => !additional[prop] || Array.isArray(additional[prop]))) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title={intl.get("match.additional-info")}
        titleTypographyProps={{
          variant: "h2",
        }}
      />
      <CardContent>
        <Grid container>
          {additional.referee && !Array.isArray(additional.referee) && (
            <Row title={intl.get("match.referee")}>
              <Typography component="span">
                {(!settings.originalNames && additional.referee.common_name_loc) || additional.referee.common_name}
              </Typography>
            </Row>
          )}
          {(additional.firstAssistant || additional.secondAssistant) &&
            (!Array.isArray(additional.firstAssistant) || !Array.isArray(additional.secondAssistant)) && (
              <Row title={intl.get("match.assistants")}>
                <Box sx={{ display: "flex" }}>
                  {additional.firstAssistant && !Array.isArray(additional.firstAssistant) && (
                    <Typography component="div">
                      {(!settings.originalNames && additional.firstAssistant.common_name_loc) ||
                        additional.firstAssistant.common_name}
                    </Typography>
                  )}
                  {additional.secondAssistant && !Array.isArray(additional.secondAssistant) && (
                    <Typography component="div" style={{ marginLeft: 24 }}>
                      {(!settings.originalNames && additional.secondAssistant.common_name_loc) ||
                        additional.secondAssistant.common_name}
                    </Typography>
                  )}
                </Box>
              </Row>
            )}
          {additional.fourthOfficial && !Array.isArray(additional.fourthOfficial) && (
            <Row title={intl.get("match.fourth-official")}>
              <Typography component="span">
                {(!settings.originalNames && additional.fourthOfficial.common_name_loc) ||
                  additional.fourthOfficial.common_name}
              </Typography>
            </Row>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default observer(Additional);
