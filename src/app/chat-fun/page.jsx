import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import BlogBreadcrumb from "@/components/breadcrumb/blog-breadcrumb";
import BlogPostboxArea from "@/components/blog/blog-postox/blog-postbox-area";
import GhibliImageGenerator from "@/components/chat-fun/chat";
import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Thetidbit | Studio Ghibli Image Generator",
};

export default function Ghibli() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <GhibliImageGenerator />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
