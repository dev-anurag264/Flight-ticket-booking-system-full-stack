import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { registerSchema } from "../../auth/schemas";
import { useAuth } from "../../auth/useAuth";
import AuthLayout from "../../components/ui/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ErrorState from "../../components/ui/ErrorState";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data) {
    setServerError(null);
    try {
      await registerUser(data.name, data.email, data.password);
      navigate("/");
    } catch (err) {
      setServerError(err);
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-ink-900 font-medium hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {serverError && <ErrorState error={serverError} />}

        <Input
          label="Full name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full mt-2"
        >
          {isSubmitting ? "Creating account" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
