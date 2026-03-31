import { useFormStatus } from "react-dom";
import { Button, Input, Heading, Text, Icon, Field } from ".";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      isLoading={pending}
      disabled={pending}
    >
      {label}
    </Button>
  );
}

export type AuthFormMode = "signing up" | "signing in" | "resetting password";

export interface AuthFormUIProps {
  mode: AuthFormMode;
  onModeChange: (mode: AuthFormMode) => void;
  formAction: (payload: FormData) => void;
  actionState: { error: string; message: string };
  onGoogleSignIn?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function AuthFormUI({
  mode,
  onModeChange,
  formAction,
  actionState,
  onGoogleSignIn,
  title,
  description,
}: AuthFormUIProps) {
  const defaultTitle =
    mode === "signing up"
      ? "Sign up"
      : mode === "signing in"
        ? "Sign In"
        : "Reset Password";

  return (
    <div className="pb:text-left pb:overflow-hidden">
      <Heading level={2} className="pb:text-center pb:mb-2">
        {title || defaultTitle}
      </Heading>

      <form className="md:pb:m-10 sm:pb:m-4 pb:space-y-4" action={formAction}>
        {description && (
          <Text className="pb:text-center pb:mb-6" variant="muted">
            {description}
          </Text>
        )}

        {mode === "resetting password" && (
          <Text className="pb:text-center pb:font-bold pb:text-dark-primary">
            {actionState.message}
          </Text>
        )}
        <Text className="pb:text-center" variant="error">
          {actionState.error}
        </Text>

        <div className="pb:space-y-4">
          <Field
            id="email"
            label="Email"
            error={
              actionState.error && actionState.error.includes("email")
                ? actionState.error
                : ""
            }
          >
            <Input
              name="email"
              type="email"
              required
              placeholder="Email"
              leftIcon={<Icon name="envelope" />}
            />
          </Field>

          {mode !== "resetting password" && (
            <Field
              id="password"
              label="Password"
              error={
                actionState.error && actionState.error.includes("password")
                  ? actionState.error
                  : ""
              }
            >
              <Input
                name="password"
                type="password"
                required
                placeholder="Password"
                leftIcon={<Icon name="lockClosed" />}
              />
            </Field>
          )}
        </div>

        <div className="pb:text-center pb:mt-6 pb:space-y-4">
          {mode === "signing up" && <SubmitButton label="Sign Up" />}
          {mode === "signing in" && <SubmitButton label="Sign In" />}
          {mode === "resetting password" && (
            <SubmitButton label="Reset Password" />
          )}

          <div className="pb:text-center pb:text-sm pb:text-gray-500">
            {mode === "signing up" && (
              <Text>
                Already have an account?{" "}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onModeChange("signing in")}
                  className="pb:underline pb:p-0 pb:h-auto hover:pb:bg-transparent"
                >
                  Sign in
                </Button>
              </Text>
            )}
            {mode === "signing in" && (
              <div className="pb:flex pb:flex-col pb:gap-2">
                <Text>
                  Forgot your password?{" "}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onModeChange("resetting password")}
                    className="pb:underline pb:p-0 pb:h-auto hover:pb:bg-transparent"
                  >
                    Reset password.
                  </Button>
                </Text>
                <div className="pb:relative">
                  <div className="pb:absolute pb:inset-0 pb:flex pb:items-center">
                    <div className="pb:w-full pb:border-t pb:border-gray-300"></div>
                  </div>
                  <div className="pb:relative pb:flex pb:justify-center pb:text-sm">
                    <span className="pb:px-2 pb:bg-white pb:text-gray-500">or</span>
                  </div>
                </div>
                <Text>
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onModeChange("signing up")}
                    className="pb:underline pb:p-0 pb:h-auto hover:pb:bg-transparent"
                  >
                    Sign up
                  </Button>
                </Text>
              </div>
            )}
            {mode === "resetting password" && (
              <div className="pb:flex pb:flex-col pb:gap-2">
                <Text>
                  Don&apos;t have an account?{" "}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onModeChange("signing up")}
                    className="pb:underline pb:p-0 pb:h-auto hover:pb:bg-transparent"
                  >
                    Sign up
                  </Button>
                </Text>
                <div className="pb:relative">
                  <div className="pb:absolute pb:inset-0 pb:flex pb:items-center">
                    <div className="pb:w-full pb:border-t pb:border-gray-300"></div>
                  </div>
                  <div className="pb:relative pb:flex pb:justify-center pb:text-sm">
                    <span className="pb:px-2 pb:bg-white pb:text-gray-500">or</span>
                  </div>
                </div>
                <Text>
                  Remembered your password?
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onModeChange("signing in")}
                    className="pb:underline pb:p-0 pb:h-auto hover:pb:bg-transparent"
                  >
                    Sign In
                  </Button>
                </Text>
              </div>
            )}
          </div>
        </div>

        {mode !== "resetting password" && onGoogleSignIn && (
          <div className="pb:text-center pb:mt-4">
            <Button
              variant="secondary"
              onClick={onGoogleSignIn}
              type="button"
              className="pb:w-full pb:flex pb:items-center pb:justify-center pb:gap-2"
            >
              <Icon name="google" stroke="none" />
              {mode === "signing up" && <span>Sign up with Google</span>}
              {mode === "signing in" && <span>Sign in with Google</span>}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
