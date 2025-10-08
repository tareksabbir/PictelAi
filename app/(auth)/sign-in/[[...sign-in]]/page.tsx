import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center">
      <SignIn />
    </section>
  );
}
