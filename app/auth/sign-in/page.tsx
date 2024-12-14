"use client";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        callbackUrl: "/convert/new",
      });
    } catch (error) {
      console.log("GitHub authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full mt-5" onClick={handleGoogleSignIn}>
      <Button
        variant="outline"
        className="w-full bg-background"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Icons.loader className="animate-spin mr-2" />
            Wait...
          </>
        ) : (
          <>
            <FaGoogle className="mr-2 h-4 w-4" />
            Continue with Google
          </>
        )}
      </Button>
    </div>
  );
};

export default SignInPage;
