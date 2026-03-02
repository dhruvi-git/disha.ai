import { SignIn } from "@clerk/clerk-react";

const AuthPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <SignIn routing="path" path="/auth" />
    </div>
  );
};

export default AuthPage;