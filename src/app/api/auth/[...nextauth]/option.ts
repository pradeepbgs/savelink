import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import {dbConnection} from "@/lib/dbconnect";
import { userModel } from "@/models/user.model";
import GithubProvider from "next-auth/providers/github"


export const AuthOptions:NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? '',
          }),
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials:{
                email: {label:"Email",type:"text"},
                password: {label:"password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnection()
                try {
                    const user = await userModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier},

                        ]
                    })

                    if (!user) throw new Error("No user found with credential")

                    const decodedPassword = await bcrypt
                    .compare(String(credentials.password),String(user.password))

                    if (decodedPassword){
                        return user
                    } else {
                        throw new Error("Invalid password")
                    }

                } catch (error:any) {
                    throw new Error(error) 
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token._id = user.id?.toString();
            token.username = user.username;
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user._id = token._id;
            session.user.username = token.username;
          }
          return session;
        }
      },      
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET
}