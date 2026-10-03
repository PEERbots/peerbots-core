import React from "react";
import type { Preview } from "@storybook/react-vite";
import "../src/styles/index.css";
import { PeerbotsI18nProvider } from "../src/i18n/PeerbotsI18nProvider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Internationalization locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", right: "🇺🇸", title: "English" },
          { value: "ar", right: "🇪🇬", title: "Arabic (RTL)" },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { locale } = context.globals;
      const isArabic = locale === "ar";
      const sampleLabels = isArabic
        ? {
            auth: {
              signIn: "تسجيل الدخول",
              signUp: "إنشاء حساب",
              resetPassword: "إعادة تعيين كلمة المرور",
              email: "البريد الإلكتروني",
              password: "كلمة المرور",
              forgotPassword: "نسيت كلمة المرور؟",
              alreadyHaveAccount: "لديك حساب بالفعل؟",
              dontHaveAccount: "ليس لديك حساب؟",
              rememberedPassword: "تذكرت كلمة المرور؟",
              or: "أو",
              signInWithGoogle: "تسجيل الدخول باستخدام جوجل",
              signUpWithGoogle: "إنشاء حساب باستخدام جوجل",
            },
            common: {
              select: "اختر...",
            },
          }
        : undefined;

      return (
        <PeerbotsI18nProvider
          dir={isArabic ? "rtl" : "ltr"}
          lang={locale}
          labels={sampleLabels}
        >
          <Story />
        </PeerbotsI18nProvider>
      );
    },
  ],
};

export default preview;
