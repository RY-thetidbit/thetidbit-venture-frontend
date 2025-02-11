import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import RefundPolicy from "@/components/refund-policy/refund-policy";

import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Thetidbit | Thetidbit.in - Refund Policy",
};

export default function ContactPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <RefundPolicy />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
