import React from "react";
// import { useNavigate, useLocation, useParams } from 'react-router';
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Hidden from "@/components/Hidden/Hidden";
import ListItemIcon from "@mui/material/ListItemIcon";
import Flag from "@/components/Flag";
import Select from "@/components/Select";
import { useRouter } from "next/router";
import { useLocale } from "@/hooks/useLocale";

const LOCALES = [
  {
    id: "ar",
    flag: "SA",
    name: "العربية",
    short: "SAU",
  },
  {
    id: "bn",
    flag: "BD",
    name: "বাংলা",
    short: "BGD",
  },
  {
    id: "bg",
    flag: "BG",
    name: "Български",
    short: "BGR",
  },
  {
    id: "cs",
    flag: "CZ",
    name: "Český",
    short: "CZE",
  },
  {
    id: "da",
    flag: "DK",
    name: "Dansk",
    short: "DNK",
  },
  {
    id: "de",
    flag: "DE",
    name: "Deutsch",
    short: "DEU",
  },
  {
    id: "el",
    flag: "GR",
    name: "ελληνικά",
    short: "GRC",
  },
  {
    id: "en",
    flag: "GB",
    name: "English",
    short: "ENG",
  },
  {
    id: "es",
    flag: "ES",
    name: "Español",
    short: "ESP",
  },
  {
    id: "fi",
    flag: "FI",
    name: "Suomi",
    short: "FIN",
  },
  {
    id: "fr",
    flag: "FR",
    name: "Français",
    short: "FRA",
  },
  {
    id: "hi",
    flag: "IN",
    name: "Hindī",
    short: "IND",
  },
  {
    id: "hr",
    flag: "HR",
    name: "Hrvatski",
    short: "HRV",
  },
  {
    id: "hu",
    flag: "HU",
    name: "Magyar",
    short: "HUN",
  },
  {
    id: "id",
    flag: "ID",
    name: "Bahasa Indonesia",
    short: "IDN",
  },
  {
    id: "it",
    flag: "IT",
    name: "Italiano",
    short: "ITA",
  },
  {
    id: "ja",
    flag: "JP",
    name: "日本語",
    short: "JPN",
  },
  {
    id: "ka",
    flag: "GE",
    name: "ქართული",
    short: "GEO",
  },
  {
    id: "ko",
    flag: "KR",
    name: "한국어",
    short: "KOR",
  },
  {
    id: "nl",
    flag: "NL",
    name: "Nederlands",
    short: "NLD",
  },
  {
    id: "nn",
    flag: "NO",
    name: "Norsk",
    short: "NOR",
  },
  {
    id: "pl",
    flag: "PL",
    name: "Polski",
    short: "POL",
  },
  {
    id: "pt",
    flag: "BR",
    name: "Português",
    short: "BRA",
  },
  {
    id: "ro",
    flag: "RO",
    name: "Română",
    short: "ROU",
  },
  {
    id: "ru",
    flag: "RU",
    name: "Русский",
    short: "RUS",
  },
  {
    id: "sl",
    flag: "SI",
    name: "Slovenščina",
    short: "SVN",
  },
  {
    id: "sk",
    flag: "SK",
    name: "Slovakian",
    short: "SVK",
  },
  {
    id: "sr",
    flag: "RS",
    name: "Српски",
    short: "SRB",
  },
  {
    id: "sv",
    flag: "SE",
    name: "Svenska",
    short: "SWE",
  },
  {
    id: "th",
    flag: "TH",
    name: "ภาษาไทย",
    short: "THA",
  },
  {
    id: "tr",
    flag: "TR",
    name: "Türkçe",
    short: "TUR",
  },
  {
    id: "uk",
    flag: "UA",
    name: "Українська",
    short: "UKR",
  },
  {
    id: "vi",
    flag: "VN",
    name: "Tiếng Việt",
    short: "VNM",
  },
  {
    id: "zh",
    flag: "CN",
    name: "中文",
    short: "CHN",
  },
];

export function LanguageMenu(): React.ReactElement {
  const router = useRouter();
  const changeLocale = useLocale();
  const currentLocale = LOCALES.find((locale) => locale.id === router.locale);
  return (
    <Select
      label={<Hidden mdDown>{currentLocale?.short}</Hidden>}
      startIcon={currentLocale ? <Flag country={currentLocale.flag} /> : undefined}
      enableMargin
    >
      {(onClose) =>
        LOCALES.map((locale) => (
          <MenuItem
            key={locale.id}
            selected={locale.id === router.locale}
            onClick={() => {
              changeLocale(locale.id);
              onClose();
            }}
          >
            <ListItemIcon>
              <Flag country={locale.flag} />
            </ListItemIcon>
            <ListItemText primary={locale.name} />
          </MenuItem>
        ))
      }
    </Select>
  );
}
