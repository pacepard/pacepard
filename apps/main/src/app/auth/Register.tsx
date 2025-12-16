import { AuthLayout } from "@/components/layouts/auth-layout";
import RegisterForm from "@/components/shared/auth/register-form";
import useLocationDetection from "@/hooks/useLocationDetection";
import { useEffect } from "react";

const Register = () => {
  const { detectUserLocation } = useLocationDetection();

  useEffect(() => {
    // Auto-detect location on registration page load
    detectUserLocation();
  }, [detectUserLocation]);

  return (
    <>
    <AuthLayout
      title="Create your Pacepard account"
      description="Enter your information below to create your account"
      maxWidth="sm"
    >
      <RegisterForm />
    </AuthLayout>
    </>
  );
};

export default Register;
