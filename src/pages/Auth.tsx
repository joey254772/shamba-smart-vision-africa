
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleAuthSuccess = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-agriculture-primary"></div>
      </div>
    );
  }

  return <AuthForm onAuthSuccess={handleAuthSuccess} />;
};

export default Auth;
