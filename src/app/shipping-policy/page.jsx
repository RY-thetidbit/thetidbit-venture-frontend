import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShippingPolicy from "@/components/shipping-policy/shipping-policy";

import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Thetidbit | Thetidbit.in - Shipping Policy Policy",
};

export default function ContactPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ShippingPolicy />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
