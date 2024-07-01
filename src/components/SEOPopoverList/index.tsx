import { MyLeague, MyTeam } from "@/api";
import React, { FC } from "react";
import NavLink from "../shared/NavLink";
import Link from "next/link";
import { fontSize } from "@mui/system";
import { slugify } from "@/utils";

export enum EListType {
  leagues = "leagues",
  teams = "teams",
}

type TSEOPopoverProps = {
  list: MyTeam[] | MyLeague[];
  listType: EListType;
};

type TListItemProps = {
  url: string;
  title: string;
};

const ListItem: FC<TListItemProps> = ({ title, url }) => {
  return (
    <Link style={{ fontSize: 0 }} href={url}>
      {title}
    </Link>
  );
};

export const SEOPopover: FC<TSEOPopoverProps> = ({ list, listType }) => {
  return (
    <div style={{ display: "flex", position: "absolute", maxWidth: 0, maxHeight: 0, zIndex: -1 }}>
      {list.map(({ name, name_loc, _id }, i) => {
        const url = `/soccer/${listType}/${slugify(name)}/${_id}/summary`;

        return <ListItem key={url + i} title={name_loc || name} url={url} />;
      })}
    </div>
  );
};
