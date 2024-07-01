import Page from "@/components/shared/Page";
import { getSSPWithT } from "@/utils/get-ssp-i18n";
import Link from "next/link";

const About = (): JSX.Element => {
  return (
    <Page
      meta={{
        title: "About",
        description: "Test description about page",
      }}
    >
      <div>
        <Link href="/">
          <h2>Home</h2>
        </Link>
      </div>
    </Page>
  );
};

export default About;

export const getServerSideProps = getSSPWithT();
