import Head from "next/head";

type HeaderProps = {
  children?: React.ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <Head>
      <title>Astrid & Roald</title>
      <link href="/bouquet.png" rel="icon" />
      {children}
    </Head>
  );
}

Header.defaultProps = {
  children: undefined,
};
