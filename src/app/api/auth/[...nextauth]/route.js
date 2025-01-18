import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../../libs/mongoConnects";
import { User } from "../../../models/voter";
import bcrypt from "bcryptjs";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        nationalId: {
          label: "National ID",
          type: "text",
          placeholder: "Your National ID",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { nationalId, password } = credentials;

          if (!nationalId || !password) {
            throw new Error("National ID and password are required.");
          }

          await connectToDatabase();

          const user = await User.findOne({ nationalId });
          if (!user) {
            throw new Error("User not found.");
          }

          const passwordValid = await bcrypt.compare(password, user.password);
          if (!passwordValid) {
            throw new Error("Invalid credentials.");
          }

          return {
            id: user._id.toString(),
            fullName: user.fullName,
            nationalId: user.nationalId,
            district: user.district,
            municipality: user.municipality,
            admin: user.admin,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Authorization failed.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullName = user.fullName;
        token.nationalId = user.nationalId;
        token.district = user.district;
        token.municipality = user.municipality;
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        fullName: token.fullName,
        nationalId: token.nationalId,
        district: token.district,
        municipality: token.municipality,
        admin: token.admin,
      };
      return session;
    },
  },
  secret: process.env.SECRET || "your-default-secret",
  pages: {
    signIn: "/auth/signin", // Customize the sign-in page if needed
    error: "/auth/error", // Customize error page
  },
  debug: process.env.NODE_ENV === "development", // Enable debugging in development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
