'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'username must be at least 2 characters.',
  }),

  password: z.string().min(6, {
    message: 'password must be at least 6 characters',
  }),
});

export function LoginForm() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // call an api to login
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setErrorMessage('Invalid credentials');
        setOpen(true);
        return;
      }

      const data = await response.json();
      // const token = data.token;

      // Store the token in localStorage or cookies
      // localStorage.setItem('token', token);
      document.cookie = `token=${data.token}; path=/;`;

      // Redirect to the dashboard or another page
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred');
      setOpen(true);
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your username below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="shadcn"
                          {...field}
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="shadcn"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Login Failed</AlertDialogTitle>
          <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          <AlertDialogAction onClick={() => setOpen(false)}>
            OK
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
