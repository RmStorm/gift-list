import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

export const UserSchema = {
  name: "User",
  target: Adapters.TypeORM.Models.User.model,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    // Adds a food_preference to the User schema
    food_preference: {
      type: "text",
      nullable: true,
    },
  },
};

export default NextAuth({
  callbacks: {
    async session(session, user) {
      let newSession = { ...session };
      newSession.user.foodPreference = user.food_preference;
      return session;
    },
  },
  providers: [
    // Passwordless / email sign in
    Providers.Email({
      server: {
        service: "gmail", // no need to set host or port etc. gmail is known
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
  adapter: Adapters.TypeORM.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DATABASE_URL_AND_NAME}`,
    // The second argument can be used to pass custom models and schemas
    {
      models: {
        User: {
          model: Adapters.TypeORM.Models.User.model,
          schema: UserSchema,
        },
      },
    }
  ),
});
