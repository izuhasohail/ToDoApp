export declare module "next-auth" {
    interface User {
      id: string
    }
  
    interface Session {
        user: User & {
          id: string
          name: string
          email: string
          image: string
        }
      }
  }
  