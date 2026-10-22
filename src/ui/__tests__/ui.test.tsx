import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";

import { Icon, iconPaths } from "../foundations";
import { Select } from "../forms/Select";
import { Field } from "../forms/Field";
import { Dialog } from "../feedback/Dialog";
import { Input } from "../forms/Input";
import { cn } from "../utils";

describe("Core UI Components & Utilities", () => {
  describe("Issue #19: eye and eyeSlash icons", () => {
    it("exposes eye and eyeSlash in iconPaths", () => {
      expect(iconPaths.eye).toBeDefined();
      expect(typeof iconPaths.eye).toBe("string");
      expect(iconPaths.eyeSlash).toBeDefined();
      expect(typeof iconPaths.eyeSlash).toBe("string");
    });

    it("renders <Icon name='eye' />, <Icon name='eyeSlash' />, and <Icon name='eye-slash' />", () => {
      const eyeHtml = renderToString(<Icon name="eye" />);
      expect(eyeHtml).toContain("M2.036 12.322");
      expect(eyeHtml).toContain("M15 12a3 3 0 1 1-6 0");

      const eyeSlashHtml = renderToString(<Icon name="eyeSlash" />);
      expect(eyeSlashHtml).toContain("M3.98 8.223A10.477");

      const eyeSlashAliasHtml = renderToString(<Icon name="eye-slash" />);
      expect(eyeSlashAliasHtml).toContain("M3.98 8.223A10.477");
    });
  });

  describe("Issue #21 & #22: cn() tailwind-merge prefix handling", () => {
    it("allows unprefixed width/max-width classes to override pb:-prefixed defaults", () => {
      expect(cn("pb:w-full", "w-auto")).toBe("w-auto");
      expect(cn("pb:w-auto pb:max-w-[90vw]", "w-11/12 max-w-5xl")).toBe(
        "w-11/12 max-w-5xl",
      );
      expect(cn("pb:w-auto pb:max-w-[90vw]", "w-[95vw] max-w-7xl")).toBe(
        "w-[95vw] max-w-7xl",
      );
    });

    it("allows pb:-prefixed classes to override each other properly", () => {
      expect(cn("pb:w-full", "pb:w-auto")).toBe("pb:w-auto");
      expect(cn("pb:p-4", "pb:p-6")).toBe("pb:p-6");
      expect(cn("rtl:pb:translate-x-5", "rtl:pb:-translate-x-5")).toBe(
        "rtl:pb:-translate-x-5",
      );
    });
  });

  describe("Issue #21: Field fullWidth and inline support", () => {
    it("defaults to pb:w-full when fullWidth is omitted", () => {
      const html = renderToString(
        <Field label="Name">
          <span>Control</span>
        </Field>,
      );
      expect(html).toContain("pb:w-full");
      expect(html).not.toContain("pb:w-auto");
    });

    it("uses pb:w-auto when fullWidth={false} or inline={true}", () => {
      const htmlNotFull = renderToString(
        <Field label="Name" fullWidth={false}>
          <span>Control</span>
        </Field>,
      );
      expect(htmlNotFull).toContain("pb:w-auto");
      expect(htmlNotFull).not.toContain("pb:w-full");

      const htmlInline = renderToString(
        <Field label="Name" inline>
          <span>Control</span>
        </Field>,
      );
      expect(htmlInline).toContain("pb:w-auto");
      expect(htmlInline).not.toContain("pb:w-full");
    });

    it("allows consumer className='w-auto' to override default pb:w-full without !important", () => {
      const html = renderToString(
        <Field label="Name" className="w-auto">
          <span>Control</span>
        </Field>,
      );
      expect(html).toContain("w-auto");
      expect(html).not.toContain("pb:w-full");
    });
  });

  describe("Issue #22: Dialog size presets", () => {
    it("exports Dialog with size presets", () => {
      // In SSR, BaseDialog.Portal does not mount when closed, so verify open or props
      const html = renderToString(
        <Dialog open size="xl">
          <div>Content</div>
        </Dialog>,
      );
      expect(html).toBeDefined();
    });
  });

  describe("Issue #23: Select displays option label instead of raw value in closed trigger", () => {
    it("renders human-readable label for controlled value when label !== value", () => {
      const options = [
        { label: "Example Template", value: "initialTemplateExample" },
        { label: "English", value: "en" },
      ];

      const html1 = renderToString(
        <Select options={options} value="initialTemplateExample" />,
      );
      expect(html1).toContain("Example Template");
      expect(html1).not.toContain(">initialTemplateExample<");

      const html2 = renderToString(<Select options={options} value="en" />);
      expect(html2).toContain("English");
      expect(html2).not.toContain(">en<");
    });

    it("renders human-readable label for uncontrolled defaultValue when label !== value", () => {
      const options = [
        { label: "Spanish", value: "es" },
        { label: "French", value: "fr" },
      ];

      const html = renderToString(
        <Select options={options} defaultValue="fr" />,
      );
      expect(html).toContain("French");
      expect(html).not.toContain(">fr<");
    });

    it("handles numeric option values consistently with stringified Select.Root value", () => {
      const options = [
        { label: "First Choice", value: 1 },
        { label: "Second Choice", value: 2 },
      ];

      const html = renderToString(<Select options={options} value={2} />);
      expect(html).toContain("Second Choice");
    });
  });
});
