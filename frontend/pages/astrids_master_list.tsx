import { useSession } from "next-auth/client";

function About() {
  const [session, loading] = useSession();

  if (session?.user.email === "astridhult4@gmail.com") {
    return <div>Hey Astrid</div>;
  }
  return <div>You're not allowed!!! Ya punchy bastard!!!!</div>;
}

export default About;
