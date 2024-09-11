import EmailVerifyArea from "@/components/email-verify/email-verify-area";

export const metadata = {
  title: "Thetidbit | Thetidbit.in - Email Verify Page",
};

export default function EmailVerifyPage({ params }) {
  return (
    <>
      <EmailVerifyArea token={params.token} />
    </>
  );
}
