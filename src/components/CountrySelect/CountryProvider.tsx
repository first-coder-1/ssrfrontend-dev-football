import React, { createContext, useEffect, useState } from "react";
import { Country, getCountries } from "../../api";
import { useIntl } from "@/hooks/useIntl";

export const CountryContext = createContext([] as Country[]);

export function CountryProvider(
  props: React.PropsWithChildren<{}>
): React.ReactElement {
  const intl = useIntl();
  const [countries, setCountries] = useState<Country[]>([]);
  useEffect(() => {
    const [promise, cancel] = getCountries();
    promise.then((res) =>
      setCountries(
        res.data
          .map((country) => ({
            ...country,
            name_loc: intl.get(`countries.${country.country_iso2}`),
          }))
          .sort((a, b) => a.name_loc.localeCompare(b.name_loc))
      )
    );
    return cancel;
    //@TODO make smth with intl to prevent intl dep looping requests
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // (intl was useEffect dep)
  return (
    <CountryContext.Provider value={countries}>
      {props.children}
    </CountryContext.Provider>
  );
}

export default CountryProvider;
