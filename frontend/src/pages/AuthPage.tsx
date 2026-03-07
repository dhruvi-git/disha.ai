import { SignIn, SignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const isSignUp = location.pathname.includes("sign-up");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {isSignUp ? (
        <SignUp
          routing="path"
          path="/sign-up"
          afterSignUpUrl="/dashboard"
        />
      ) : (
        <SignIn
          routing="path"
          path="/sign-in"
          afterSignInUrl="/dashboard"
        />
      )}
    </div>
  );
};

export default AuthPage;