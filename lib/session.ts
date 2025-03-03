
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    console.log("Getting session:", session)
    
    if (!session) {
      return null
    }
    
    return session.user
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}