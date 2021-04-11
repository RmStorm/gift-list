import styles from "../styles/Footer.module.css";

export default function Footer(): React.ReactElement | null {
  return (
    <footer className={styles.footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        rel="noopener noreferrer"
        target="_blank"
      >
        Powered by{" "}
        <img alt="Vercel Logo" className={styles.logo} src="/vercel.svg" />
      </a>
    </footer>
  );
}
