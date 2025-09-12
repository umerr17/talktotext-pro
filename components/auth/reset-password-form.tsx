import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff, Check } from "lucide-react"
import { motion } from "framer-motion"
import { resetPassword } from "@/lib/api"
import Link from "next/link"
//Just for Push
function ResetPasswordFormComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token, router])

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    }
  }
  const passwordRequirements = validatePassword(password)
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }
    if (!isPasswordValid) {
        setError("Password does not meet the requirements.")
        setIsLoading(false)
        return
    }

    try {
      await resetPassword(token!, password)
      setSuccess(true)
      setTimeout(() => router.push("/login?reset=success"), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may be invalid or expired.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="w-full max-w-md glass">
          <CardHeader className="space-y-1 text-center">
             <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Password Reset Successful</CardTitle>
            <CardDescription>You can now sign in with your new password.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
                <Link href="/login">
                    Back to Sign In
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="w-full max-w-md glass">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create a new password</CardTitle>
          <CardDescription className="text-center">
            Your new password must be at least 8 characters long.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
               <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
                 {password && (
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center gap-1 ${passwordRequirements.length ? "text-green-600" : "text-muted-foreground"}`}>
                    <Check className={`h-3 w-3 ${passwordRequirements.length ? "opacity-100" : "opacity-30"}`} />
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-1 ${passwordRequirements.uppercase ? "text-green-600" : "text-muted-foreground"}`}>
                    <Check className={`h-3 w-3 ${passwordRequirements.uppercase ? "opacity-100" : "opacity-30"}`} />
                    One uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${passwordRequirements.lowercase ? "text-green-600" : "text-muted-foreground"}`}>
                    <Check className={`h-3 w-3 ${passwordRequirements.lowercase ? "opacity-100" : "opacity-30"}`} />
                    One lowercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${passwordRequirements.number ? "text-green-600" : "text-muted-foreground"}`}>
                    <Check className={`h-3 w-3 ${passwordRequirements.number ? "opacity-100" : "opacity-30"}`} />
                    One number
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                    {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    </Button>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}


export function ResetPasswordForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordFormComponent />
        </Suspense>
    )
}
