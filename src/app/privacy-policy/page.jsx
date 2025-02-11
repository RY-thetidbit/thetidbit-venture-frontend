import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import PrivacyPolicy from "@/components/privacy-policy/privacy-policy";

import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Thetidbit | Thetidbit.in - Privacy Policy Policy",
};

export default function ContactPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <PrivacyPolicy />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
