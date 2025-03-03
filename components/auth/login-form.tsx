"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    setIsLoading(false)

    if (!signInResult?.ok) {
      return toast.error("Your sign in request failed. Please try again.")
    }

    router.refresh()
    router.push("/dashboard")
  }

  const handleGoogleSignIn = async () => {
    console.log("Google Sign In")
    setIsGoogleLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="w-full px-4 sm:px-6 flex justify-center items-center">
      <Card className="w-full max-w-md mx-auto shadow-lg border-opacity-50">
        <CardHeader className="space-y-1 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm sm:text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="name@example.com" 
                        {...field} 
                        className="h-9 sm:h-10 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-offset-1"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground text-sm sm:text-base">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="********" 
                        {...field} 
                        className="h-9 sm:h-10 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-offset-1"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full mt-4 sm:mt-6 h-9 sm:h-10 text-sm sm:text-base transition-all duration-200 hover:shadow-md font-medium"
                disabled={isLoading}
              >
                {isLoading && <Icons.spinner className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
          
          <div className="relative my-4 sm:my-6">
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            type="button" 
            onClick={handleGoogleSignIn} 
            disabled={isGoogleLoading}
            className="w-full h-9 sm:h-10 text-sm sm:text-base transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            {isGoogleLoading ? (
              <Icons.spinner className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            )}{" "}
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}