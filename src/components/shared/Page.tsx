import { useMst } from "@/store";
import HeadMeta, { type HeadMetaProps } from "./HeadMeta";
import { observer } from "mobx-react-lite";

export type PageProps = React.PropsWithChildren<{
  meta?: HeadMetaProps;
}>;

const Page: React.FC<PageProps> = ({ children, meta = {} }) => {
  const store = useMst();
  return (
    <>
      <HeadMeta {...meta} />
      <pre
        style={{
          textAlign: "center",
          maxWidth: "600px",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      >
        dark: {`${store.settings.dark}`}
      </pre>
      {children}
    </>
  );
};

export default observer(Page);
