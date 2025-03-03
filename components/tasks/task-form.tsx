"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Task title is required.",
  }),
})

export function TaskForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      form.reset()
      router.refresh()
      toast.success("Task created successfully")
    } catch (error) {
      toast.error("Failed to create task")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border-opacity-40 shadow-sm hover:shadow transition-all duration-200 bg-white/5 dark:bg-slate-900/20 backdrop-blur-sm">
      <CardContent className="p-3 sm:p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormControl>
                    <Input 
                      placeholder="Add a new task..." 
                      {...field} 
                      disabled={isLoading}
                      className="h-10 sm:h-11 text-sm sm:text-base 
                                bg-white/50 dark:bg-slate-800/50
                                border-slate-200 dark:border-slate-700
                                focus:border-slate-300 dark:focus:border-slate-600
                                transition-all duration-200 focus:ring-2 focus:ring-offset-1 
                                rounded-md placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-6 min-w-20 font-medium
                        text-sm sm:text-base bg-indigo-500 hover:bg-indigo-600
                        dark:bg-indigo-600 dark:hover:bg-indigo-700
                        text-white transition-all duration-300 shadow-sm hover:shadow"
            >
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <Icons.spinner className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Add Task</span>
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}