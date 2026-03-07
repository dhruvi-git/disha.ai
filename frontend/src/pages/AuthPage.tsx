import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useLocation, Navigate } from "react-router-dom";

const AuthPage = () => {
  const { isSignedIn } = useUser();
  const location = useLocation();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const isSignUp = location.pathname.includes("sign-up");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {isSignUp ? (
        <SignUp routing="path" path="/sign-up" />
      ) : (
        <SignIn routing="path" path="/sign-in" />
      )}
    </div>
  );
};

export default AuthPage;