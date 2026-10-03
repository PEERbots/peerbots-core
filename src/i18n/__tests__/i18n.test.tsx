import { describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";

import {
  PeerbotsI18nProvider,
  usePeerbotsI18n,
  isRTL,
  DEFAULT_AUTH_FORM_LABELS,
  DEFAULT_COMMON_LABELS,
} from "../index";
import { Icon } from "../../ui/foundations/Icon";
import { Input } from "../../ui/forms/Input";
import { Select } from "../../ui/forms/Select";
import { Switch } from "../../ui/forms/Switch";
import { AuthFormUI } from "../../ui/patterns/AuthFormUI";

describe("Internationalization & Bidirectional Layout Suite", () => {
  const originalDocument = globalThis.document;

  beforeEach(() => {
    const docElement: any = {
      attributes: {} as Record<string, string>,
      setAttribute(name: string, value: string) {
        this.attributes[name] = value;
      },
      getAttribute(name: string) {
        return this.attributes[name];
      },
      dir: "ltr",
      lang: "en",
    };

    globalThis.document = {
      documentElement: docElement,
    } as any;
  });

  afterEach(() => {
    globalThis.document = originalDocument;
  });

  describe("Tier 1: Built-in English Defaults (Zero Setup)", () => {
    it("renders default English labels when rendered without provider or props", () => {
      const html = renderToString(<AuthFormUI />);

      expect(html).toContain(DEFAULT_AUTH_FORM_LABELS.signIn);
      expect(html).toContain(DEFAULT_AUTH_FORM_LABELS.email);
      expect(html).toContain(DEFAULT_AUTH_FORM_LABELS.password);
      expect(html).toContain(DEFAULT_AUTH_FORM_LABELS.forgotPassword);
    });

    it("Select falls back to default placeholder", () => {
      const html = renderToString(
        <Select options={[{ label: "Option 1", value: "1" }]} />
      );
      expect(html).toContain("Select...");
    });
  });

  describe("Tier 2: Method B - Provider-level Labels (App-wide Injection)", () => {
    it("propagates Arabic labels down to AuthFormUI and Select via context", () => {
      const arabicLabels = {
        auth: {
          signIn: "تسجيل الدخول",
          email: "البريد الإلكتروني",
          password: "كلمة المرور",
        },
        common: {
          select: "اختر...",
        },
      };

      const html = renderToString(
        <PeerbotsI18nProvider dir="rtl" lang="ar" labels={arabicLabels}>
          <AuthFormUI />
          <Select options={[{ label: "خيار 1", value: "1" }]} />
        </PeerbotsI18nProvider>
      );

      expect(document.documentElement.dir).toBe("rtl");
      expect(document.documentElement.lang).toBe("ar");

      // AuthFormUI picks up from Provider context
      expect(html).toContain("تسجيل الدخول");
      expect(html).toContain("البريد الإلكتروني");
      expect(html).toContain("كلمة المرور");

      // Select picks up from Provider context
      expect(html).toContain("اختر...");
    });
  });

  describe("Tier 3: Method A - Component-level Prop Override", () => {
    it("overrides Provider labels when labels prop is passed directly to component", () => {
      const providerLabels = {
        auth: {
          signIn: "General Sign In",
          email: "General Email",
        },
      };

      const html = renderToString(
        <PeerbotsI18nProvider labels={providerLabels}>
          <AuthFormUI
            labels={{
              signIn: "Sign In as Admin",
            }}
          />
        </PeerbotsI18nProvider>
      );

      // Overridden key uses component prop
      expect(html).toContain("Sign In as Admin");
      // Unspecified key falls back to provider context
      expect(html).toContain("General Email");
      // Key absent in both falls back to built-in default
      expect(html).toContain(DEFAULT_AUTH_FORM_LABELS.forgotPassword);
    });
  });

  describe("Bidirectional (LTR & RTL) Layout & CSS Logical Properties", () => {
    it("Input uses CSS logical properties ps-* and pe-* and start/end coordinates", () => {
      const html = renderToString(
        <Input
          id="test-input"
          leftIcon={<span>L</span>}
          rightIcon={<span>R</span>}
        />
      );

      expect(html).toContain("pb:ps-10");
      expect(html).toContain("pb:pe-10");
      expect(html).toContain("pb:start-0");
      expect(html).toContain("pb:end-0");
      expect(html).not.toContain("pb:pl-10");
      expect(html).not.toContain("pb:pr-10");
    });

    it("Select uses logical padding ps-* and pe-* and end-0", () => {
      const html = renderToString(
        <Select options={[{ label: "Test", value: "test" }]} />
      );
      expect(html).toContain("pb:ps-3");
      expect(html).toContain("pb:pe-3");
    });

    it("Switch thumb contains RTL translation class", () => {
      const html = renderToString(<Switch checked />);
      expect(html).toContain("rtl:pb:data-[checked]:-translate-x-5");
    });

    it("Icon automatically mirrors directional icons in RTL and supports shouldMirror", () => {
      const htmlChevron = renderToString(<Icon name="chevronRight" />);
      expect(htmlChevron).toContain("rtl:pb:-scale-x-100");

      const htmlCheck = renderToString(<Icon name="check" />);
      expect(htmlCheck).not.toContain("rtl:pb:-scale-x-100");

      const htmlForced = renderToString(<Icon name="check" shouldMirror={true} />);
      expect(htmlForced).toContain("rtl:pb:-scale-x-100");

      const htmlDisabled = renderToString(
        <Icon name="chevronRight" shouldMirror={false} />
      );
      expect(htmlDisabled).not.toContain("rtl:pb:-scale-x-100");
    });
  });

  describe("Generative Invariant & Property Fuzzing", () => {
    it("correctly identifies RTL vs LTR languages with arbitrary subtags", () => {
      const rtlLanguages = ["ar", "ar-EG", "ar-SA", "he", "he-IL", "fa", "fa-IR", "ur"];
      const ltrLanguages = ["en", "en-US", "fr", "de", "es", "zh", "ja", "ru"];

      for (const lang of rtlLanguages) {
        expect(isRTL(lang)).toBe(true);
      }

      for (const lang of ltrLanguages) {
        expect(isRTL(lang)).toBe(false);
      }

      expect(isRTL("")).toBe(false);
      expect(isRTL(undefined)).toBe(false);
    });

    it("fuzzes icon shouldMirror prop ensuring mirror invariant", () => {
      const iconNames = ["chevronRight", "check", "arrowRightOnRectangle", "folder"] as const;

      for (let i = 0; i < 40; i++) {
        const name = iconNames[Math.floor(Math.random() * iconNames.length)];
        const shouldMirror = Math.random() > 0.5;

        const html = renderToString(<Icon name={name as any} shouldMirror={shouldMirror} />);

        if (shouldMirror) {
          expect(html).toContain("rtl:pb:-scale-x-100");
        } else {
          expect(html).not.toContain("rtl:pb:-scale-x-100");
        }
      }
    });
  });
});
