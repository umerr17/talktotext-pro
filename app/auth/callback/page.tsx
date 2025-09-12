"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

function AuthCallbackComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Store the token in localStorage
            localStorage.setItem('token', token);
            // Redirect to the dashboard
            router.push('/dashboard');
        } else {
            // If no token is found, redirect to login with an error
            router.push('/login?error=auth_failed');
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="w-full max-w-md glass">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Signing In</CardTitle>
                        <CardDescription>Please wait while we authenticate your account...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}


export default function AuthCallbackPage() {
    // Suspense is required for useSearchParams to work correctly in Next.js App Router
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthCallbackComponent />
        </Suspense>
    );
}
