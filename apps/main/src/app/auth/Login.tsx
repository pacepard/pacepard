import { AuthLayout } from "@/components/layouts/auth-layout";
import LoginForm from "@/components/shared/auth/login-form";
import { useNavigate } from "react-router";

const Login = () => {

  const navigate = useNavigate();

  return (
    // description="Let's get you login to your account"
    <>
      <AuthLayout
        title="Login to Pacepard"
        description="Don't have an account?"
        maxWidth="sm" 
        buttonLabel="Get started"
        onButtonClick={() => navigate("/register")}
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default Login;
