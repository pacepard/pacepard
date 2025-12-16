import { AuthLayout } from "@/components/layouts/auth-layout";
import LoginForm from "@/components/shared/auth/login-form";

const Login = () => {
  return (
    // description="Let's get you login to your account"
    <>
      <AuthLayout
        title="Login to your account"
        description="Enter your email below to login to your account"
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default Login;
