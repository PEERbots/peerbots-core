import { useFormStatus } from "react-dom";
import { Button, Input, Heading, Text, Icon, Field } from "..";
import React, { useState } from "react";
import {
  DEFAULT_AUTH_FORM_LABELS,
  AuthFormLabels,
  usePeerbotsI18n,
} from "../../i18n";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color="primary"
      isLoading={pending}
      disabled={pending}
    >
      {label}
    </Button>
  );
}

export type AuthFormMode = "signing up" | "signing in" | "resetting password";

export interface AuthFormUIProps {
  mode?: AuthFormMode;
  onModeChange?: (mode: AuthFormMode) => void;
  formAction?: (payload: FormData) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  actionState?: { error?: string; message?: string };
  onGoogleSignIn?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  labels?: Partial<AuthFormLabels>;
}

export function AuthFormUI({
  mode: propMode,
  onModeChange: propOnModeChange,
  formAction,
  onSubmit,
  actionState = { error: "", message: "" },
  onGoogleSignIn,
  title,
  description,
  labels: propLabels,
}: AuthFormUIProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const [internalMode, setInternalMode] = useState<AuthFormMode>("signing in");
  const mode = propMode ?? internalMode;
  const onModeChange = propOnModeChange ?? setInternalMode;

  // 3-tier cascade: Component Prop (Method A) -> Provider Context (Method B) -> Built-in English Defaults
  const labels: AuthFormLabels = {
    ...DEFAULT_AUTH_FORM_LABELS,
    ...contextLabels?.auth,
    ...propLabels,
  };

  const defaultTitle =
    mode === "signing up"
      ? labels.signUp
      : mode === "signing in"
        ? labels.signIn
        : labels.resetPassword;

  const emailLabel = labels.email || labels.emailLabel;
  const passwordLabel = labels.password || labels.passwordLabel;

  return (
    <div className="pb:text-start pb:overflow-hidden">
      <Heading level={2} className="pb:text-center pb:mb-2">
        {title || defaultTitle}
      </Heading>

      <form
        className="pb:md:m-10 pb:sm:m-4 pb:space-y-4"
        action={formAction}
        onSubmit={onSubmit}
      >
        {description && (
          <Text className="pb:text-center pb:mb-6" color="muted">
            {description}
          </Text>
        )}

        {mode === "resetting password" && actionState?.message && (
          <Text className="pb:text-center pb:font-bold pb:text-dark-primary">
            {actionState.message}
          </Text>
        )}
        {actionState?.error && (
          <Text className="pb:text-center" color="error">
            {actionState.error}
          </Text>
        )}

        <div className="pb:space-y-4">
          <Field
            id="email"
            label={emailLabel}
            error={
              actionState?.error && actionState.error.includes("email")
                ? actionState.error
                : ""
            }
          >
            <Input
              name="email"
              type="email"
              required
              placeholder={emailLabel}
              leftIcon={<Icon name="envelope" />}
            />
          </Field>

          {mode !== "resetting password" && (
            <Field
              id="password"
              label={passwordLabel}
              error={
                actionState?.error && actionState.error.includes("password")
                  ? actionState.error
                  : ""
              }
            >
              <Input
                name="password"
                type="password"
                required
                placeholder={passwordLabel}
                leftIcon={<Icon name="lockClosed" />}
              />
            </Field>
          )}
        </div>

        <div className="pb:text-center pb:mt-6 pb:space-y-4">
          {mode === "signing up" && <SubmitButton label={labels.signUp} />}
          {mode === "signing in" && <SubmitButton label={labels.signIn} />}
          {mode === "resetting password" && (
            <SubmitButton label={labels.resetPassword} />
          )}

          <div className="pb:text-center pb:text-sm pb:text-gray-500">
            {mode === "signing up" && (
              <Text size="sm">
                {labels.alreadyHaveAccount}{" "}
                <Button
                  variant="link"
                  color="teal"
                  size="sm"
                  onClick={() => onModeChange("signing in")}
                >
                  {labels.signIn}
                </Button>
              </Text>
            )}
            {mode === "signing in" && (
              <div className="pb:flex pb:flex-col pb:gap-2">
                <Text size="sm">
                  {labels.forgotPassword}{" "}
                  <Button
                    variant="link"
                    color="teal"
                    size="sm"
                    onClick={() => onModeChange("resetting password")}
                  >
                    {labels.resetPassword}
                  </Button>
                </Text>
                <div className="pb:relative">
                  <div className="pb:absolute pb:inset-0 pb:flex pb:items-center">
                    <div className="pb:w-full pb:border-t pb:border-gray-300"></div>
                  </div>
                  <div className="pb:relative pb:flex pb:justify-center pb:text-sm">
                    <span className="pb:px-2 pb:bg-white pb:text-gray-700">
                      {labels.or}
                    </span>
                  </div>
                </div>
                <Text size="sm">
                  {labels.dontHaveAccount}{" "}
                  <Button
                    variant="link"
                    color="teal"
                    size="sm"
                    onClick={() => onModeChange("signing up")}
                  >
                    {labels.signUp}
                  </Button>
                </Text>
              </div>
            )}
            {mode === "resetting password" && (
              <div className="pb:flex pb:flex-col pb:gap-2">
                <Text size="sm">
                  {labels.dontHaveAccount}{" "}
                  <Button
                    variant="link"
                    color="teal"
                    size="sm"
                    onClick={() => onModeChange("signing up")}
                  >
                    {labels.signUp}
                  </Button>
                </Text>
                <div className="pb:relative">
                  <div className="pb:absolute pb:inset-0 pb:flex pb:items-center">
                    <div className="pb:w-full pb:border-t pb:border-gray-300"></div>
                  </div>
                  <div className="pb:relative pb:flex pb:justify-center pb:text-sm">
                    <span className="pb:px-2 pb:bg-white pb:text-gray-700">
                      {labels.or}
                    </span>
                  </div>
                </div>
                <Text size="sm">
                  {labels.rememberedPassword}{" "}
                  <Button
                    variant="link"
                    color="teal"
                    size="sm"
                    onClick={() => onModeChange("signing in")}
                  >
                    {labels.signIn}
                  </Button>
                </Text>
              </div>
            )}
          </div>
        </div>

        {mode !== "resetting password" && onGoogleSignIn && (
          <div className="pb:text-center pb:mt-4">
            <Button
              color="neutral"
              onClick={onGoogleSignIn}
              type="button"
              className="pb:w-full pb:flex pb:items-center pb:justify-center pb:gap-2"
            >
              <Icon name="google" stroke="none" />
              {mode === "signing up" && (
                <span>{labels.signUpWithGoogle}</span>
              )}
              {mode === "signing in" && (
                <span>{labels.signInWithGoogle}</span>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
