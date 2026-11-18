import { describe, expect, it, vi } from "vitest";
import {
  EXAMPLE_AGENT_FLAT_TEMPLATE_JSON,
  EXAMPLE_LEGACY_PALETTE_CSV,
  EXAMPLE_LOG_AND_SPEAK_TEMPLATE,
  EXAMPLE_MODERN_PALETTE_CSV,
  EXAMPLE_PALETTE,
  EXAMPLE_PALETTE_TEMPLATE,
  EXAMPLE_QA_AND_COLORS_TEMPLATE,
  EXAMPLE_STARTER_SOCIAL_TEMPLATE,
  MAX_TEMPLATE_FILE_BYTES,
  blankTemplate,
  canExportCollection,
  convertPaletteToCSV,
  convertTemplateToPalette,
  exportCollectionAsJson,
  exportTemplateAsJson,
  exportTemplateAsPaletteCsv,
  extractMessageButtons,
  isCollectionJson,
  isPaidMarketplaceCopy,
  parseCollectionJson,
  parsePaletteCsv,
  parseTemplateFile,
  parseTemplateJson,
  parseTemplatePttf,
  parseTemplateText,
  serializeCollectionJson,
  serializeTemplateJson,
  serializeTemplatePttf,
  type OrderedTemplatesObject,
  type Template,
} from "../index";

describe("parseTemplateJson — shapes, Log preservation, and ParseTemplateOptions", () => {
  it("keeps id undefined by default when canonical Template JSON omits id, and generates id when generateMissingIds is true", () => {
    const rawWithoutId = JSON.stringify({
      title: "Classroom Greeting",
      buttons: {
        b1: {
          type: "Message",
          labelColor: "Blue",
          details: {
            title: "Hello",
            speech: "Hello everyone!",
            color: "Blue",
            emotion: "Happy",
          },
        },
      },
      hierarchy: { root: ["b1"] },
    });

    const [defaultParsed] = parseTemplateJson(rawWithoutId);
    expect(defaultParsed.id).toBeUndefined();
    expect("id" in defaultParsed).toBe(false);

    const [withGeneratedId] = parseTemplateJson(rawWithoutId, {
      generateMissingIds: true,
    });
    expect(withGeneratedId.id).toBe("classroom-greeting");

    const multiWithoutIds = JSON.stringify([
      { title: "Same Title", buttons: [{ title: "A", speech: "A" }] },
      { title: "Same Title", buttons: [{ title: "B", speech: "B" }] },
    ]);
    const generatedMulti = parseTemplateJson(multiWithoutIds, "pack.json", {
      generateMissingIds: true,
    });
    expect(generatedMulti.map((t) => t.id)).toEqual([
      "same-title",
      "same-title-2",
    ]);
  });

  it("strips id, contentID, and contentName when stripDatabaseMetadata is true while preserving them when false", () => {
    const exportedFromFirestore = JSON.stringify({
      id: "firestore-doc-99",
      title: "Downloaded Pack",
      description: "Saved from controller",
      contentID: "content-abc",
      contentName: "Collection ABC",
      sourceContentId: "marketplace-origin-1",
      buttons: {
        m1: {
          type: "Message",
          labelColor: "Green",
          details: {
            title: "Welcome",
            speech: "Welcome!",
            color: "Green",
            emotion: "Happy",
          },
        },
      },
      hierarchy: { root: ["m1"] },
    });

    const [kept] = parseTemplateJson(exportedFromFirestore);
    expect(kept.id).toBe("firestore-doc-99");
    expect(kept.contentID).toBe("content-abc");
    expect(kept.contentName).toBe("Collection ABC");
    expect(kept.sourceContentId).toBe("marketplace-origin-1");

    const [stripped] = parseTemplateJson(exportedFromFirestore, {
      stripDatabaseMetadata: true,
    });
    expect(stripped.id).toBeUndefined();
    expect(stripped.contentID).toBeUndefined();
    expect(stripped.contentName).toBeUndefined();
    expect("id" in stripped).toBe(false);
    expect("contentID" in stripped).toBe(false);
    expect("contentName" in stripped).toBe(false);
    expect(stripped.sourceContentId).toBe("marketplace-origin-1");
    expect(stripped.title).toBe("Downloaded Pack");
  });

  it("preserves valid Log buttons and skips invalid Log buttons missing title", () => {
    const jsonWithLogs = JSON.stringify({
      title: "Session Log Test",
      buttons: {
        speak1: {
          type: "Message",
          labelColor: "Light Blue",
          details: {
            title: "",
            speech: "Fallback title from speech",
            color: "Light Blue",
            emotion: "Neutral",
          },
        },
        speak2: {
          type: "Message",
          labelColor: "Pink",
          details: {
            title: "Fallback speech from title",
            speech: "",
            color: "Pink",
            emotion: "Happy",
          },
        },
        validLog: {
          type: "Log",
          labelColor: "Grey",
          details: {
            title: "Prompted Student",
            details: "Used visual cue",
            metadata: { trial: 2, completed: true },
          },
        },
        invalidLog: {
          type: "Log",
          labelColor: "Grey",
          details: {
            title: "   ",
          },
        },
      },
      hierarchy: {
        root: ["speak1", "speak2", "validLog", "invalidLog"],
      },
    });

    const [parsed] = parseTemplateJson(jsonWithLogs);
    expect(parsed.hierarchy.root).toEqual(["speak1", "speak2", "validLog"]);
    expect(parsed.buttons.speak1.details.title).toBe(
      "Fallback title from speech",
    );
    if (parsed.buttons.speak2.type === "Message") {
      expect(parsed.buttons.speak2.details.speech).toBe(
        "Fallback speech from title",
      );
    }
    expect(parsed.buttons.validLog).toEqual({
      type: "Log",
      labelColor: "Grey",
      details: {
        title: "Prompted Student",
        details: "Used visual cue",
        metadata: { trial: 2, completed: "true" },
      },
    });
  });

  it("parses Template[], { templates: [...] }, OrderedTemplatesObject, flat { buttons: [...] }, and raw button arrays", () => {
    // 1. OrderedTemplatesObject
    const ordered: OrderedTemplatesObject = {
      templates: {
        second: { ...blankTemplate, title: "Second" },
        first: { ...blankTemplate, title: "First" },
      },
      order: ["first", "second"],
    };
    const fromOrdered = parseTemplateJson(JSON.stringify(ordered));
    expect(fromOrdered.map((t) => [t.id, t.title])).toEqual([
      ["first", "First"],
      ["second", "Second"],
    ]);

    // 2. Wrapped { templates: [...] } with duplicate flat IDs & semicolon keywords
    const wrapped = JSON.stringify({
      templates: [
        {
          id: "pack-a",
          title: "Pack A",
          buttons: [
            { id: "dup", title: "One", speech: "One" },
            { id: "dup", title: "Two", speech: "Two", keywords: "hi;hey,yo" },
          ],
        },
      ],
    });
    const [packA] = parseTemplateJson(wrapped);
    expect(packA.id).toBe("pack-a");
    expect(packA.hierarchy.root).toEqual(["dup", "dup-2"]);
    if (packA.buttons["dup-2"].type === "Message") {
      expect(packA.buttons["dup-2"].details.keywords).toEqual([
        "hi",
        "hey",
        "yo",
      ]);
    }

    // 3. Raw button array with fallbackTitle option
    const rawArray = JSON.stringify([{ title: "Wave", speech: "Hi there!" }]);
    const [fromRawArray] = parseTemplateJson(rawArray, {
      fallbackTitle: "Custom Fallback Title",
    });
    expect(fromRawArray.title).toBe("Custom Fallback Title");
    expect(fromRawArray.id).toBeUndefined();
  });

  it("throws descriptive errors on invalid or empty JSON", () => {
    expect(() => parseTemplateJson("{bad", "broken.json")).toThrow(
      /Invalid JSON in "broken.json"/i,
    );
    expect(() => parseTemplateJson("[]", "empty.json")).toThrow(
      /No valid template buttons found in "empty.json"/i,
    );
    expect(() => parseTemplateJson('{"title":"Empty"}')).toThrow(
      /No valid template buttons/i,
    );
  });
});

describe("parseTemplateText & parseTemplateFile (size limits and FileReader fallbacks)", () => {
  it("auto-detects JSON objects, JSON arrays, BOM-prefixed JSON, Modern CSV, Legacy CSV, and Generic CSV", () => {
    expect(
      parseTemplateText(EXAMPLE_AGENT_FLAT_TEMPLATE_JSON)[0].id,
    ).toBe("starter-social-greeting");
    expect(
      parseTemplateText(
        `\uFEFF${JSON.stringify([{ title: "Hi", speech: "Hello" }])}`,
      ),
    ).toHaveLength(1);
    expect(parseTemplateText(EXAMPLE_MODERN_PALETTE_CSV)).toHaveLength(1);
    expect(parseTemplateText(EXAMPLE_LEGACY_PALETTE_CSV)).toHaveLength(1);
    expect(
      parseTemplateText("title,speech\nQuick,Quick speech", {
        fallbackTitle: "Detected CSV",
      })[0].title,
    ).toBe("Detected CSV");
    expect(() => parseTemplateText("   \n  ", "blank.txt")).toThrow(
      /is empty/i,
    );
  });

  it("accepts files at exact MAX_TEMPLATE_FILE_BYTES boundary and rejects MAX_TEMPLATE_FILE_BYTES + 1", async () => {
    const validPayload = JSON.stringify([
      { title: "Boundary", speech: "Exact limit OK" },
    ]);
    const exactBoundaryFile = new File([validPayload], "boundary.json", {
      type: "application/json",
    });
    Object.defineProperty(exactBoundaryFile, "size", {
      value: MAX_TEMPLATE_FILE_BYTES,
    });

    const parsed = await parseTemplateFile(exactBoundaryFile, {
      generateMissingIds: true,
    });
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe("boundary");

    const overBoundaryFile = new File([validPayload], "too-large.json", {
      type: "application/json",
    });
    Object.defineProperty(overBoundaryFile, "size", {
      value: MAX_TEMPLATE_FILE_BYTES + 1,
    });
    await expect(parseTemplateFile(overBoundaryFile)).rejects.toThrow(
      /exceeds the 2 MB maximum allowed size/i,
    );
  });

  it("supports FileReader fallback when File.prototype.text is unavailable and propagates FileReader errors", async () => {
    const OriginalFileReader = globalThis.FileReader;

    class MockSuccessFileReader {
      result: string | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsText() {
        this.result = "title,speech\nFromReader,Hello from FileReader";
        this.onload?.();
      }
    }

    class MockErrorFileReader {
      result: string | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsText() {
        this.onerror?.();
      }
    }

    const fakeFileWithoutText = {
      name: "legacy-browser.csv",
      size: 64,
    } as unknown as File;

    try {
      globalThis.FileReader =
        MockSuccessFileReader as unknown as typeof FileReader;
      const res = await parseTemplateFile(fakeFileWithoutText);
      expect(res[0].title).toBe("legacy-browser");
      expect(extractMessageButtons(res[0])[0].details.speech).toBe(
        "Hello from FileReader",
      );

      globalThis.FileReader =
        MockErrorFileReader as unknown as typeof FileReader;
      await expect(parseTemplateFile(fakeFileWithoutText)).rejects.toThrow(
        /Unable to read template file "legacy-browser.csv"/i,
      );
    } finally {
      globalThis.FileReader = OriginalFileReader;
    }
  });
});

describe("Canonical examples.ts round-trip invariants", () => {
  const canonicalTemplates: [string, Template][] = [
    ["EXAMPLE_QA_AND_COLORS_TEMPLATE", EXAMPLE_QA_AND_COLORS_TEMPLATE],
    ["EXAMPLE_PALETTE_TEMPLATE", EXAMPLE_PALETTE_TEMPLATE],
    ["EXAMPLE_STARTER_SOCIAL_TEMPLATE", EXAMPLE_STARTER_SOCIAL_TEMPLATE],
    ["EXAMPLE_LOG_AND_SPEAK_TEMPLATE", EXAMPLE_LOG_AND_SPEAK_TEMPLATE],
  ];

  it.each(canonicalTemplates)(
    "round-trips %s losslessly through serializeTemplateJson -> parseTemplateJson",
    (_name, fixture) => {
      const json = serializeTemplateJson(fixture, true);
      const [rehydrated] = parseTemplateJson(json);
      expect(rehydrated).toEqual(fixture);
    },
  );

  it("validates button counts, hierarchy links, and CSV/JSON parity across all examples.ts fixtures", () => {
    expect(Object.keys(EXAMPLE_QA_AND_COLORS_TEMPLATE.buttons)).toHaveLength(17);
    expect(EXAMPLE_QA_AND_COLORS_TEMPLATE.hierarchy["6"]).toHaveLength(11);

    expect(Object.keys(EXAMPLE_PALETTE_TEMPLATE.buttons)).toHaveLength(17);
    expect(
      extractMessageButtons(EXAMPLE_STARTER_SOCIAL_TEMPLATE).some(
        (b) => b.isFallback,
      ),
    ).toBe(true);

    // EXAMPLE_LOG_AND_SPEAK_TEMPLATE has 5 total buttons (3 Message + 2 Log)
    expect(Object.keys(EXAMPLE_LOG_AND_SPEAK_TEMPLATE.buttons)).toHaveLength(5);
    expect(extractMessageButtons(EXAMPLE_LOG_AND_SPEAK_TEMPLATE)).toHaveLength(
      3,
    );

    // EXAMPLE_PALETTE matches both modern and legacy CSV fixtures
    expect(parsePaletteCsv(EXAMPLE_MODERN_PALETTE_CSV, EXAMPLE_PALETTE.title)).toEqual(
      EXAMPLE_PALETTE,
    );
    expect(parsePaletteCsv(EXAMPLE_LEGACY_PALETTE_CSV, EXAMPLE_PALETTE.title)).toEqual(
      EXAMPLE_PALETTE,
    );

    // Palette round-trip from EXAMPLE_QA_AND_COLORS_TEMPLATE preserves all 17 buttons
    const qaPalette = convertTemplateToPalette(EXAMPLE_QA_AND_COLORS_TEMPLATE);
    expect(qaPalette.buttons).toHaveLength(17);
    expect(
      parsePaletteCsv(convertPaletteToCSV(qaPalette), qaPalette.title),
    ).toEqual(qaPalette);
  });

  it("supports minified serializeTemplateJson(template, false) and cleans dangling hierarchy IDs", () => {
    const compact = serializeTemplateJson(EXAMPLE_LOG_AND_SPEAK_TEMPLATE, false);
    expect(compact.includes("\n")).toBe(false);
    expect(parseTemplateJson(compact)[0]).toEqual(EXAMPLE_LOG_AND_SPEAK_TEMPLATE);

    const messyJson = JSON.stringify({
      title: "Messy Hierarchy",
      buttons: {
        valid1: { title: "Flat in Dict", speech: "Hello from dict!" },
      },
      hierarchy: {
        root: ["valid1", "ghostRoot"],
        valid1: ["ghostChild"],
        ghostParent: ["valid1"],
      },
    });
    const [cleaned] = parseTemplateJson(messyJson);
    expect(cleaned.hierarchy).toEqual({
      root: ["valid1"],
      valid1: [],
    });
  });

  it("synthesizes root hierarchy when hierarchy is omitted and handles OrderedTemplatesObject without order", () => {
    const withoutHierarchy = JSON.stringify({
      buttons: {
        k1: { title: "One", speech: "One" },
        k2: { title: "Two", speech: "Two" },
      },
    });
    const [parsed] = parseTemplateJson(withoutHierarchy, "missing-h.json");
    expect(parsed.hierarchy.root).toEqual(["k1", "k2"]);

    const unorderedMap = JSON.stringify({
      templates: {
        alpha: { ...blankTemplate, title: "Alpha" },
        beta: { ...blankTemplate, title: "Beta" },
      },
    });
    const mapTemplates = parseTemplateJson(unorderedMap, "bundle.json", {
      stripDatabaseMetadata: true,
    });
    expect(mapTemplates.map((t) => t.title)).toEqual(["Alpha", "Beta"]);
    expect(mapTemplates.every((t) => t.id === undefined)).toBe(true);
  });

  it("preserves round-trip invariants across 50 randomized Template & CSV payloads", () => {
    const colors = ["Light Blue", "Blue", "Green", "Red", "Purple", "Pink", "Yellow", "Orange"] as const;
    const emotions = ["Neutral", "Surprised", "Happy", "Sad", "Concerned", "Sleepy"] as const;

    for (let i = 0; i < 50; i++) {
      const btnCount = 1 + (i % 6);
      const buttons: Template["buttons"] = {};
      const root: string[] = [];

      for (let b = 0; b < btnCount; b++) {
        const key = `btn_${i}_${b}`;
        const color = colors[(i + b) % colors.length];
        const emotion = emotions[(i * 2 + b) % emotions.length];
        buttons[key] = {
          type: "Message",
          labelColor: color,
          details: {
            title: `Prompt ${i}-${b}, "quoted"`,
            speech: `Speech line ${i}-${b}!`,
            color,
            emotion,
            metadata: {
              goal: `Goal ${b}`,
              subgoal: "None",
              proficiency: "1",
            },
          },
        };
        root.push(key);
      }

      const tpl: Template = {
        id: `fuzz-tpl-${i}`,
        title: `Fuzz Template ${i}`,
        buttons,
        hierarchy: { root },
      };

      // JSON round-trip
      const [fromJson] = parseTemplateJson(serializeTemplateJson(tpl, false));
      expect(fromJson).toEqual(tpl);

      // Modern & Legacy CSV round-trip via Palette
      const palette = convertTemplateToPalette(tpl);
      expect(parsePaletteCsv(convertPaletteToCSV(palette), palette.title)).toEqual(
        palette,
      );
      expect(
        parsePaletteCsv(
          convertPaletteToCSV(palette, { format: "legacy" }),
          palette.title,
        ),
      ).toEqual(palette);
    }
  });
});

describe("parseTemplatePttf, serializeTemplatePttf, and .pttf auto-detection", () => {
  it("serializes a template to PTTF and parses it back cleanly", () => {
    const pttf = serializeTemplatePttf(EXAMPLE_LOG_AND_SPEAK_TEMPLATE);
    expect(pttf).toContain(`// ${EXAMPLE_LOG_AND_SPEAK_TEMPLATE.title}`);
    expect(pttf).toContain("- [");
    expect(pttf).toContain("! [");

    const parsed = parseTemplatePttf(pttf, "example.pttf", {
      generateMissingIds: true,
    });
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe(EXAMPLE_LOG_AND_SPEAK_TEMPLATE.title);
    expect(parsed[0].id).toBeTruthy();
    expect(Object.keys(parsed[0].buttons).length).toBeGreaterThanOrEqual(2);
  });

  it("auto-detects .pttf file hints and PTTF syntax in parseTemplateText without breaking CSV", () => {
    const pttfSource = [
      "// Greeting Flow",
      "",
      "- [Green] :) Hello | Hello there!",
      "  ! [Grey] Log Greeting | User greeted robot",
      "  -> #follow-up",
      "- #follow-up [Blue] Ask Name | What is your name?",
    ].join("\n");

    const byExtension = parseTemplateText(pttfSource, "greeting.pttf");
    expect(byExtension).toHaveLength(1);
    expect(byExtension[0].title).toBe("Greeting Flow");
    expect(byExtension[0].hierarchy?.root).toHaveLength(2);

    const byContent = parseTemplateText(pttfSource);
    expect(byContent).toHaveLength(1);
    expect(byContent[0].title).toBe("Greeting Flow");

    const fromCsv = parseTemplateText(EXAMPLE_MODERN_PALETTE_CSV);
    expect(fromCsv).toHaveLength(1);
    expect(Object.keys(fromCsv[0].buttons).length).toBeGreaterThan(0);

    const multilineCsvWithDashLine = [
      "title,speech,color,emotion",
      '"Greeting","Hello!',
      '- Nice to meet you!",Green,Happy',
    ].join("\n");
    const fromMultilineCsv = parseTemplateText(multilineCsvWithDashLine);
    expect(fromMultilineCsv).toHaveLength(1);
    expect(Object.values(fromMultilineCsv[0].buttons)[0].details.title).toBe(
      "Greeting",
    );
  });

  it("throws descriptive errors on invalid PTTF diagnostics or empty PTTF", () => {
    expect(() =>
      parseTemplatePttf(
        "- [Green] Broken | Hi\n  -> #missing-anchor",
        "broken.pttf",
      ),
    ).toThrow(/Invalid PTTF in "broken\.pttf".*missing-anchor/);

    expect(() => parseTemplatePttf("// Empty Only", "empty.pttf")).toThrow(
      /No valid template buttons found in PTTF "empty\.pttf"/,
    );
  });

  it("parses .pttf files via parseTemplateFile", async () => {
    const pttf = serializeTemplatePttf(EXAMPLE_STARTER_SOCIAL_TEMPLATE);
    const file = new File([pttf], "starter-social.pttf", {
      type: "text/plain",
    });

    const parsed = await parseTemplateFile(file);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe(EXAMPLE_STARTER_SOCIAL_TEMPLATE.title);
  });
});

describe("exportTemplateAsJson & exportTemplateAsPaletteCsv browser download helpers", () => {
  it("triggers anchor download with .json and .csv filenames and revokes object URLs", () => {
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:mock-url");
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => undefined);

    const downloads: { href: string; download: string }[] = [];
    const origCreateElement = document.createElement.bind(document);
    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockImplementation(((tagName: string) => {
        const el = origCreateElement(tagName);
        if (tagName.toLowerCase() === "a") {
          vi.spyOn(el as HTMLAnchorElement, "click").mockImplementation(() => {
            downloads.push({
              href: (el as HTMLAnchorElement).href,
              download: (el as HTMLAnchorElement).download,
            });
          });
        }
        return el;
      }) as typeof document.createElement);

    try {
      exportTemplateAsJson(EXAMPLE_STARTER_SOCIAL_TEMPLATE);
      exportTemplateAsJson(EXAMPLE_STARTER_SOCIAL_TEMPLATE, "custom-name");
      exportTemplateAsPaletteCsv(EXAMPLE_STARTER_SOCIAL_TEMPLATE);
      exportTemplateAsPaletteCsv(EXAMPLE_STARTER_SOCIAL_TEMPLATE, {
        format: "legacy",
        fileName: "legacy-export.csv",
      });
      exportCollectionAsJson({
        name: "Mindfulness Pack",
        description: "Collection of mindfulness exercises",
        templates: [EXAMPLE_STARTER_SOCIAL_TEMPLATE, EXAMPLE_LOG_AND_SPEAK_TEMPLATE],
      });

      expect(downloads).toEqual([
        {
          href: "blob:mock-url",
          download: `${EXAMPLE_STARTER_SOCIAL_TEMPLATE.title}.json`,
        },
        {
          href: "blob:mock-url",
          download: "custom-name.json",
        },
        {
          href: "blob:mock-url",
          download: `${EXAMPLE_STARTER_SOCIAL_TEMPLATE.title}_palette.csv`,
        },
        {
          href: "blob:mock-url",
          download: "legacy-export.csv",
        },
        {
          href: "blob:mock-url",
          download: "Mindfulness Pack.json",
        },
      ]);
      expect(createObjectURL).toHaveBeenCalledTimes(5);
      expect(revokeObjectURL).toHaveBeenCalledTimes(5);
    } finally {
      createElementSpy.mockRestore();
      createObjectURL.mockRestore();
      revokeObjectURL.mockRestore();
    }
  });
});

describe("serializeCollectionJson, isCollectionJson, and parseCollectionJson", () => {
  it("serializes a content collection to portable JSON (stripping database metadata by default) and round-trips via parseCollectionJson & parseTemplateJson", () => {
    const t1: Template = {
      ...EXAMPLE_STARTER_SOCIAL_TEMPLATE,
      id: "db-tpl-1",
      contentID: "content-123",
      contentName: "Classroom Collection",
    };
    const t2: Template = {
      ...EXAMPLE_LOG_AND_SPEAK_TEMPLATE,
      id: "db-tpl-2",
      contentID: "content-123",
      contentName: "Classroom Collection",
    };

    const collectionJson = serializeCollectionJson({
      name: "Classroom Collection",
      description: "Two interactive classroom templates",
      templates: [t1, t2],
    });

    expect(isCollectionJson(collectionJson)).toBe(true);
    expect(
      isCollectionJson(serializeTemplateJson(EXAMPLE_STARTER_SOCIAL_TEMPLATE)),
    ).toBe(false);
    expect(isCollectionJson("{bad json")).toBe(false);

    const parsedCollection = parseCollectionJson(collectionJson);
    expect(parsedCollection.name).toBe("Classroom Collection");
    expect(parsedCollection.description).toBe(
      "Two interactive classroom templates",
    );
    expect(parsedCollection.templates).toHaveLength(2);
    expect(parsedCollection.templates[0].id).toBeUndefined();
    expect(parsedCollection.templates[0].contentID).toBeUndefined();
    expect(parsedCollection.templates[0].title).toBe(
      EXAMPLE_STARTER_SOCIAL_TEMPLATE.title,
    );
    expect(parsedCollection.templates[1].title).toBe(
      EXAMPLE_LOG_AND_SPEAK_TEMPLATE.title,
    );

    // Also parses via parseTemplateJson for Control page multi-template import
    const templatesFromTemplateParser = parseTemplateJson(collectionJson, {
      generateMissingIds: true,
    });
    expect(templatesFromTemplateParser).toHaveLength(2);
    expect(templatesFromTemplateParser[0].id).toBeTruthy();
    expect(templatesFromTemplateParser[1].id).toBeTruthy();
  });

  it("preserves database metadata when stripDatabaseMetadata is false", () => {
    const t1: Template = {
      ...EXAMPLE_STARTER_SOCIAL_TEMPLATE,
      id: "db-tpl-1",
      contentID: "content-123",
    };
    const jsonWithMeta = serializeCollectionJson(
      {
        name: "Full Collection",
        templates: [t1],
      },
      { stripDatabaseMetadata: false, pretty: false },
    );
    expect(jsonWithMeta.includes("\n")).toBe(false);
    const parsed = parseCollectionJson(jsonWithMeta);
    expect(parsed.name).toBe("Full Collection");
    expect(parsed.templates[0].id).toBe("db-tpl-1");
    expect(parsed.templates[0].contentID).toBe("content-123");
  });

  it("blocks exporting copies of paid marketplace collections while allowing free copies and authored paid collections", () => {
    const freeCopyContent = {
      data: {
        name: "Free Marketplace Copy",
        owner: { id: "user-1" },
        public: false,
        price: 0,
        tags: [],
        trusted: false,
        copyOf: { id: "market-free-1" },
        templatesInfo: [{ id: "t1", title: "T1" }],
      },
    };
    expect(isPaidMarketplaceCopy(freeCopyContent)).toBe(false);
    expect(canExportCollection(freeCopyContent)).toBe(true);

    const authoredPaidContent = {
      data: {
        name: "My Own Paid Pack",
        owner: { id: "user-1" },
        public: true,
        price: 24.99,
        tags: [],
        trusted: true,
        templatesInfo: [{ id: "t1", title: "T1" }],
      },
    };
    expect(isPaidMarketplaceCopy(authoredPaidContent)).toBe(false);
    expect(canExportCollection(authoredPaidContent)).toBe(true);

    const paidCopyContent = {
      data: {
        name: "Purchased Paid Copy",
        owner: { id: "user-1" },
        public: false,
        price: 24.99,
        tags: [],
        trusted: false,
        copyOf: { id: "market-paid-1" },
        templatesInfo: [{ id: "t1", title: "T1" }],
      },
    };
    expect(isPaidMarketplaceCopy(paidCopyContent)).toBe(true);
    expect(canExportCollection(paidCopyContent)).toBe(false);

    // Also blocks when local price is 0 but upstream sourcePrice > 0
    expect(isPaidMarketplaceCopy(freeCopyContent, 15)).toBe(true);
    expect(canExportCollection(freeCopyContent, 15)).toBe(false);

    // Throws when attempting to serialize or export a paid marketplace copy
    expect(() =>
      serializeCollectionJson({
        name: "Purchased Paid Copy",
        copyOf: { id: "market-paid-1" },
        price: 24.99,
        templates: [EXAMPLE_STARTER_SOCIAL_TEMPLATE],
      }),
    ).toThrow(/Cannot export a copy of a paid marketplace content collection/i);

    expect(() =>
      exportCollectionAsJson(
        {
          name: "Purchased Paid Copy",
          copyOf: { id: "market-paid-1" },
          price: 0,
          templates: [EXAMPLE_STARTER_SOCIAL_TEMPLATE],
        },
        { sourcePrice: 19.99 },
      ),
    ).toThrow(/Cannot export a copy of a paid marketplace content collection/i);

    // Single template checks
    expect(
      isPaidMarketplaceCopy({
        copyOf: { id: "market-paid-tpl-1" },
        sourcePrice: 19.99,
      }),
    ).toBe(true);
    expect(
      canExportCollection({
        copyOf: { id: "market-paid-tpl-1" },
        sourcePrice: 19.99,
      }),
    ).toBe(false);
    expect(
      isPaidMarketplaceCopy({
        copyOf: { id: "market-free-tpl-1" },
        sourcePrice: 0,
      }),
    ).toBe(false);
    expect(
      isPaidMarketplaceCopy({
        sourcePrice: 25,
      }),
    ).toBe(false);
  });
});




