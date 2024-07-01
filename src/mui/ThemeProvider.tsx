import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createCustomTheme from "@/mui/theme";
import { observer } from "mobx-react-lite";
import { useMst } from "@/store";

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {
    settings: { dark },
  } = useMst();
  return (
    <MuiThemeProvider theme={createCustomTheme(dark)}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default observer(ThemeProvider);
