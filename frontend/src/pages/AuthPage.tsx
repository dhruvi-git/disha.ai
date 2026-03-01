import { SignIn, SignUp } from "@clerk/clerk-react";

interface AuthPageProps {
  mode: "sign-in" | "sign-up";
}

const AuthPage = ({ mode }: AuthPageProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {mode === "sign-in" ? (
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      ) : (
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      )}
    </div>
  );
};

export default AuthPage;