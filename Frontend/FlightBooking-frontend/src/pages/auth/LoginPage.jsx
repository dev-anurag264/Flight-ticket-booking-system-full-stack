import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "../../auth/schemas";
import { useAuth } from "../../auth/useAuth";
import AuthLayout from "../../components/ui/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ErrorState from "../../components/ui/ErrorState";
import { useLocation } from "react-router-dom";
import { seatApi } from "../../api/seatApi";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const intent = location.state;
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    setServerError(null);
    try {
      await login(data.email, data.password);
      await resumeAfterAuth();
    } catch (err) {
      setServerError(err);
    }
  }

  async function resumeAfterAuth() {
    if (intent?.intent === "seat-hold") {
      try {
        await seatApi.hold(intent.seat.id);
        navigate("/booking/passenger-details", {
          state: {
            seat: intent.seat,
            flightId: intent.flightId,
            flight: intent.flight,
          },
        });
      } catch (err) {
        // seat may have been taken while they were logging in — send them back to reselect
        navigate(`/flights/${intent.flightId}/seats`, { replace: true });
      }
    } else {
      navigate("/");
    }
  }

  return (
    <AuthLayout
      eyebrow={intent ? "One step left" : "Welcome back"}
      title={intent ? "Log in to hold your seat" : "Log in to your account"}
      footer={
        <>
          New to EaseFly?{" "}
          <Link
            to="/register"
            state={intent}
            className="text-ink-900 font-medium hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {intent && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-[var(--radius-control)] p-3 text-sm">
            <span className="font-flight font-semibold">
              Seat {intent.seat.seatNumber}
            </span>{" "}
            is waiting for you — log in to continue your booking.
          </div>
        )}
        {serverError && <ErrorState error={serverError} context="login" />}

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
          autoComplete="current-password"
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
          {isSubmitting ? "Logging in" : "Log in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
