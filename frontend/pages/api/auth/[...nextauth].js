import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    // Passwordless / email sign in
    Providers.Email({
      server: {
        service: "gmail", // no need to set host or port etc.
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      from: "<no-reply@astridroald.nl>",
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  // Optional SQL or MongoDB database to persist users
  database: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DATABASE_URL_AND_NAME}`,
});
