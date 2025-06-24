import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import BlogPostboxArea from "@/components/blog/blog-women-fashion/page";
import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Thetidbit | Thetidbit.in - Blog Page",
};

export default function BlogPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <BlogPostboxArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
