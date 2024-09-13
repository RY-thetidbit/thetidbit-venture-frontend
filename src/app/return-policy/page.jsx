import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ReturnPolicy from "@/components/return-policy/return-policy";

import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Thetidbit | Thetidbit.in - Return Policy",
};

export default function ContactPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ReturnPolicy />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
