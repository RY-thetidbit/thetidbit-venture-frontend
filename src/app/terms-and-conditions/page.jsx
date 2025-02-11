import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import TermsAndConditions from "@/components/terms-and-conditions/terms-and-conditions";

import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Thetidbit | Thetidbit.in - Terms And Conditions Policy",
};

export default function ContactPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <TermsAndConditions />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
