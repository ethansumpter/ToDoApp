"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface AuthErrorAlertProps {
  error: any; // Firebase error object
  context: "login" | "register";
}

const getFirebaseAuthErrorMessage = (authError: any, context: "login" | "register"): string => {
  if (!authError || !authError.code) {
    return "An unexpected error occurred. Please try again.";
  }

  switch (authError.code) {
    // Common errors
    case "auth/invalid-email":
      return "The email address is not valid. Please enter a correctly formatted email.";
    case "auth/operation-not-allowed":
      if (context === "register") {
        return "Email/password accounts are not enabled. Please contact support.";
      }
      return "This sign-in method is not enabled. Please contact support.";
    
    // Registration specific
    case "auth/email-already-in-use":
      return "This email address is already in use by another account. Please use a different email or log in.";
    case "auth/weak-password":
      return "The password is too weak. Please use a stronger password (at least 6 characters).";

    // Login specific
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this email address. Please check your email or register for a new account.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again or use \'Forgot your password?\' if needed.";
    case "auth/invalid-credential": // More generic error for invalid email or password in newer SDKs
        return "The email or password you entered is incorrect. Please check your email or use \'Forgot your password?\' if needed.";


    // Google Sign-In specific errors (can occur in both contexts)
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method. Please sign in with that method.";
    case "auth/popup-blocked":
      return "The sign-in popup was blocked by your browser. Please allow popups for this site and try again.";
    case "auth/popup-closed-by-user":
      return "The sign-in window was closed. Please try again.";
    case "auth/cancelled-popup-request":
    case "auth/user-cancelled":
      return "The sign-in process was cancelled. Please try again.";
    
    default:
      return authError.message || "An unexpected error occurred. Please try again.";
  }
};

export function AuthErrorAlert({ error, context }: AuthErrorAlertProps) {
  if (!error) {
    return null;
  }

  const title = context === "login" ? "Login Failed" : "Registration Failed";
  const message = getFirebaseAuthErrorMessage(error, context);

  return (
    <Alert variant="destructive" className="fixed bottom-6 right-6 z-50 w-auto max-w-md">
      <AlertCircleIcon className="h-4 w-4" /> {/* Added className for consistency */}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
} 