import { describe, expect, it } from "vitest";
import {
  LEGACY_PALETTE_CSV_HEADERS,
  MAX_TEMPLATE_FILE_BYTES,
  MODERN_PALETTE_CSV_HEADERS,
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  blankMessageButton,
  blankTemplate,
  connectionMessage,
  convertPaletteToCSV,
  convertPaletteToTemplate,
  convertTemplateToPalette,
  extractMessageButtons,
  flattenHierarchy,
  getDirectChildIds,
  getRootButtonIds,
  normalizeEmotion,
  normalizePeerbotsColor,
  parseCsvRows,
  parsePaletteCsv,
  parseTemplateCsv,
  parseTemplateFile,
  parseTemplateJson,
  serializeCsvRows,
  serializePaletteCsv,
  serializeTemplateJson,
  type OrderedTemplatesObject,
  type Palette,
  type ProvenanceRef,
  type Template,
  type TemplateInfo,
} from "../index";

describe("templates/types", () => {
  it("exports canonical emotions, colors, and default message/template constants", () => {
    expect(PEERBOTS_EMOTIONS).toEqual([
      "Neutral",
      "Surprised",
      "Happy",
      "Sad",
      "Concerned",
      "Sleepy",
    ]);
    expect(PEERBOTS_COLORS).toContain("Light Blue");
    expect(PEERBOTS_COLORS).toHaveLength(11);
    expect(blankMessageButton.type).toBe("Message");
    expect(connectionMessage.title).toBe("Connecting");
    expect(blankTemplate.hierarchy.root).toEqual(["blank"]);
  });

  it("supports Firestore DocumentReference-like ProvenanceRef without firebase dependency", () => {
    interface MockFirestoreDocRef {
      readonly id: string;
      readonly path: string;
      readonly firestore: { app: string };
    }
    const mockDocRef: MockFirestoreDocRef = {
      id: "tpl-123",
      path: "contents/c1/templates/tpl-123",
      firestore: { app: "peerbots" },
    };

    // Assignable to default ProvenanceRef
    const ref: ProvenanceRef = mockDocRef;
    const defaultTemplate: Template = {
      ...blankTemplate,
      copyOf: mockDocRef,
    };
    const typedInfo: TemplateInfo<MockFirestoreDocRef> = {
      id: "tpl-123",
      title: "Typed Info",
      copyOf: mockDocRef,
    };

    expect(ref.id).toBe("tpl-123");
    expect(defaultTemplate.copyOf?.path).toBe("contents/c1/templates/tpl-123");
    expect(typedInfo.copyOf?.firestore.app).toBe("peerbots");
  });
});

describe("templates/hierarchy", () => {
  it("returns empty array for empty root", () => {
    expect(flattenHierarchy({ root: [] })).toEqual([]);
  });

  it("interleaves nested children in DFS order with depth", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["q1", "q2", "closing"],
      q1: ["good", "tryAgain"],
      good: ["celebrate"],
      q2: ["great"],
    };
    expect(flattenHierarchy(hierarchy)).toEqual([
      { buttonId: "q1", depth: 0 },
      { buttonId: "good", depth: 1 },
      { buttonId: "celebrate", depth: 2 },
      { buttonId: "tryAgain", depth: 1 },
      { buttonId: "q2", depth: 0 },
      { buttonId: "great", depth: 1 },
      { buttonId: "closing", depth: 0 },
    ]);
  });

  it("deduplicates shared buttons and breaks self and indirect cycles safely", () => {
    const sharedHierarchy: Template["hierarchy"] = {
      root: ["a", "b"],
      a: ["shared"],
      b: ["shared"],
    };
    expect(flattenHierarchy(sharedHierarchy)).toEqual([
      { buttonId: "a", depth: 0 },
      { buttonId: "shared", depth: 1 },
      { buttonId: "b", depth: 0 },
    ]);

    const cyclicHierarchy: Template["hierarchy"] = {
      root: ["a"],
      a: ["a", "b"],
      b: ["c"],
      c: ["a"],
      orphan: ["z"],
    };
    expect(flattenHierarchy(cyclicHierarchy)).toEqual([
      { buttonId: "a", depth: 0 },
      { buttonId: "b", depth: 1 },
      { buttonId: "c", depth: 2 },
    ]);
  });

  it("returns root button IDs and direct child IDs cleanly", () => {
    const hierarchy: Template["hierarchy"] = {
      root: ["r1", "r2", "r1"],
      r1: ["c1", "c2", "c1", "r1"],
    };
    expect(getRootButtonIds(hierarchy)).toEqual(["r1", "r2"]);
    expect(getDirectChildIds(hierarchy, "r1")).toEqual(["c1", "c2"]);
    expect(getDirectChildIds(hierarchy, "r2")).toEqual([]);
    expect(getDirectChildIds(hierarchy, "root")).toEqual([]);
    expect(getDirectChildIds(hierarchy, "")).toEqual([]);
  });

  it("extracts flat typed message buttons with childIds and fallback flags while skipping Log buttons", () => {
    const template: Template = {
      id: "checkin-tpl",
      title: "Morning Check-In",
      buttons: {
        q1: {
          type: "Message",
          labelColor: "Yellow",
          details: {
            title: "How are you?",
            speech: "Good morning! How are you feeling?",
            color: "Yellow",
            emotion: "Happy",
          },
        },
        ansHappy: {
          type: "Message",
          labelColor: "Green",
          details: {
            title: "Glad to hear",
            speech: "Yay! That makes me happy too!",
            color: "Green",
            emotion: "Happy",
          },
        },
        logNote: {
          type: "Log",
          labelColor: "Grey",
          details: {
            title: "Student responded",
            details: "Logged response",
          },
        },
        fallback1: {
          type: "Message",
          labelColor: "Orange",
          details: {
            title: "Repeat please",
            speech: "Could you say that again?",
            color: "Orange",
            emotion: "Concerned",
            metadata: { isFallback: "true" },
          },
        },
      },
      hierarchy: {
        root: ["q1", "logNote", "fallback1"],
        q1: ["ansHappy", "logNote"],
      },
    };

    const extracted = extractMessageButtons(template);
    expect(extracted).toHaveLength(3);
    expect(extracted[0]).toEqual({
      buttonKey: "q1",
      templateId: "checkin-tpl",
      templateTitle: "Morning Check-In",
      details: template.buttons.q1.details,
      labelColor: "Yellow",
      childIds: ["ansHappy"],
      isFallback: false,
    });
    expect(extracted[1].buttonKey).toBe("ansHappy");
    expect(extracted[2].buttonKey).toBe("fallback1");
    expect(extracted[2].isFallback).toBe(true);
  });
});

describe("templates/templateIO", () => {
  it("normalizes color and emotion strings and legacy 0-7 numeric codes", () => {
    expect(normalizePeerbotsColor("light blue")).toBe("Light Blue");
    expect(normalizePeerbotsColor("gray")).toBe("Grey");
    expect(normalizePeerbotsColor(0)).toBe("Light Blue");
    expect(normalizePeerbotsColor("2")).toBe("Green");
    expect(normalizePeerbotsColor("7")).toBe("Orange");
    expect(normalizePeerbotsColor("Unknown")).toBe("Light Blue");
    expect(normalizePeerbotsColor(undefined)).toBe("Light Blue");

    expect(normalizeEmotion("happy")).toBe("Happy");
    expect(normalizeEmotion("Sleep")).toBe("Sleepy");
    expect(normalizeEmotion("sleep")).toBe("Sleepy");
    expect(normalizeEmotion(0)).toBe("Neutral");
    expect(normalizeEmotion("1")).toBe("Surprised");
    expect(normalizeEmotion(5)).toBe("Sleepy");
    expect(normalizeEmotion("Unknown")).toBe("Neutral");
    expect(normalizeEmotion(null)).toBe("Neutral");
  });

  it("parses and serializes RFC-4180 CSV with commas, quotes, embedded newlines, and BOM", () => {
    const rawCsv =
      '\uFEFFtitle,speech\r\n"Hello, ""Friend""","Line 1\nLine 2"\r\n';
    const rows = parseCsvRows(rawCsv);
    expect(rows).toEqual([
      ["title", "speech"],
      ['Hello, "Friend"', "Line 1\nLine 2"],
    ]);

    const serialized = serializeCsvRows(rows[0], [rows[1]]);
    expect(parseCsvRows(serialized)).toEqual(rows);

    expect(() => parseCsvRows('title,speech\n"unterminated,hello')).toThrow(
      /Malformed CSV/i,
    );
  });

  it("converts nested and cyclic Templates to Palette via flattenHierarchy (fixing root-only bug)", () => {
    const nestedTemplate: Template = {
      title: "Nested Story",
      buttons: {
        intro: {
          type: "Message",
          labelColor: "Blue",
          details: {
            title: "Intro",
            speech: "Once upon a time",
            color: "Blue",
            emotion: "Happy",
            metadata: {
              goal: "Engagement",
              subgoal: "Attention",
              proficiency: "Emerging",
            },
          },
        },
        followup: {
          type: "Message",
          labelColor: "Green",
          details: {
            title: "Follow-up",
            speech: "What happened next?",
            color: "Green",
            emotion: "Surprised",
          },
        },
        logStep: {
          type: "Log",
          labelColor: "Grey",
          details: {
            title: "Observation",
            details: "Child smiled",
          },
        },
      },
      hierarchy: {
        root: ["intro", "logStep"],
        intro: ["followup"],
        followup: ["intro"], // Cycle back to intro
      },
    };

    const palette = convertTemplateToPalette(nestedTemplate);
    expect(palette.title).toBe("Nested Story");
    expect(palette.buttons.map((b) => b.title)).toEqual([
      "Intro",
      "Follow-up",
      "Observation",
    ]);
    expect(palette.buttons[0].goal).toBe("Engagement");
    expect(palette.buttons[1].goal).toBe("None");
    expect(palette.buttons[2].color).toBe("Light Blue");

    const roundTripped = convertPaletteToTemplate(palette);
    expect(roundTripped.hierarchy.root).toEqual(["0", "1", "2"]);
    expect(roundTripped.buttons["1"].details.title).toBe("Follow-up");
  });

  it("parses and serializes both modern Palette CSV and legacy Peerbots CSV", () => {
    const samplePalette: Palette = {
      title: "Social Skills",
      buttons: [
        {
          title: "Greet, Warmly",
          speech: 'Hi there! Say "hello"!',
          color: "Yellow",
          emotion: "Happy",
          goal: "Social",
          subgoal: "Greeting",
          proficiency: "1",
        },
        {
          title: "Rest",
          speech: "Time to rest.",
          color: "Purple",
          emotion: "Sleepy",
          goal: "None",
          subgoal: "None",
          proficiency: "None",
        },
      ],
    };

    const modernCsv = convertPaletteToCSV(samplePalette);
    expect(modernCsv.split("\r\n")[0]).toBe(
      MODERN_PALETTE_CSV_HEADERS.join(","),
    );
    const parsedModern = parsePaletteCsv(modernCsv, "Social Skills");
    expect(parsedModern).toEqual(samplePalette);

    const legacyCsvSerialized = serializePaletteCsv(samplePalette, {
      format: "legacy",
    });
    expect(legacyCsvSerialized.split("\r\n")[0]).toBe(
      LEGACY_PALETTE_CSV_HEADERS.join(","),
    );

    const legacyRawCsv = [
      "TITLE(text),COLOR(0-7),EMOTION(0-7),SPEECH(text),GOAL(text),SUBGOAL(text),PROFICIENCY(text)",
      '"Wave",2,2,"Hello friend!","Greeting","Eye Contact","Developing"',
      '"Nap Time","Purple","Sleep","I am sleepy","Rest","Calm","None"',
    ].join("\r\n");

    const parsedLegacyPalette = parsePaletteCsv(legacyRawCsv, "Legacy Pack");
    expect(parsedLegacyPalette.buttons).toEqual([
      {
        title: "Wave",
        color: "Green",
        emotion: "Happy",
        speech: "Hello friend!",
        goal: "Greeting",
        subgoal: "Eye Contact",
        proficiency: "Developing",
      },
      {
        title: "Nap Time",
        color: "Purple",
        emotion: "Sleepy",
        speech: "I am sleepy",
        goal: "Rest",
        subgoal: "Calm",
        proficiency: "None",
      },
    ]);

    const templatesFromLegacy = parseTemplateCsv(legacyRawCsv, "legacy-pack.csv");
    expect(templatesFromLegacy).toHaveLength(1);
    expect(templatesFromLegacy[0].title).toBe("legacy-pack");
    const extracted = extractMessageButtons(templatesFromLegacy[0]);
    expect(extracted[0].details.color).toBe("Green");
    expect(extracted[1].details.emotion).toBe("Sleepy");
  });

  it("parses canonical Template JSON, flat button-list JSON, array-of-templates JSON, and OrderedTemplatesObject JSON", () => {
    // 1. Canonical Template JSON
    const canonical: Template = {
      id: "canonical-1",
      title: "Canonical Template",
      description: "With hierarchy",
      buttons: {
        b1: {
          type: "Message",
          labelColor: "Pink",
          details: {
            title: "Ask Name",
            speech: "What is your name?",
            color: "Pink",
            emotion: "Happy",
          },
        },
        b2: {
          type: "Message",
          labelColor: "Blue",
          details: {
            title: "Nice to Meet You",
            speech: "Nice to meet you!",
            color: "Blue",
            emotion: "Happy",
          },
        },
      },
      hierarchy: {
        root: ["b1"],
        b1: ["b2"],
      },
    };
    const serialized = serializeTemplateJson(canonical);
    const parsedCanonical = parseTemplateJson(serialized);
    expect(parsedCanonical).toHaveLength(1);
    expect(parsedCanonical[0].hierarchy.b1).toEqual(["b2"]);

    // 2. Flat button-list JSON (agent starter format)
    const flatTemplateJson = JSON.stringify({
      id: "starter",
      title: "Starter",
      buttons: [
        {
          id: "hello",
          title: "Hello",
          speech: "Hi there!",
          color: "Light Blue",
          emotion: "Happy",
          category: "Greetings",
          keywords: ["hi", "hello"],
        },
        {
          id: "confused",
          title: "Confused",
          speech: "Say again?",
          color: "Orange",
          emotion: "Concerned",
          isFallback: true,
        },
      ],
    });
    const parsedFlat = parseTemplateJson(flatTemplateJson);
    expect(parsedFlat[0].hierarchy.root).toEqual(["hello", "confused"]);
    const flatExtracted = extractMessageButtons(parsedFlat[0]);
    expect(flatExtracted[0].details.keywords).toEqual(["hi", "hello"]);
    expect(flatExtracted[1].isFallback).toBe(true);

    // 3. Raw array of buttons JSON
    const rawButtonsJson = JSON.stringify([
      { title: "One", speech: "First speech", color: "Green", emotion: "Happy" },
    ]);
    const parsedRawArray = parseTemplateJson(rawButtonsJson, "quick.json");
    expect(parsedRawArray[0].title).toBe("quick");
    expect(extractMessageButtons(parsedRawArray[0])).toHaveLength(1);

    // 4. OrderedTemplatesObject JSON
    const orderedObj: OrderedTemplatesObject = {
      templates: {
        second: { ...blankTemplate, title: "Second" },
        first: { ...blankTemplate, title: "First" },
      },
      order: ["first", "second"],
    };
    const parsedOrdered = parseTemplateJson(JSON.stringify(orderedObj));
    expect(parsedOrdered.map((t) => t.title)).toEqual(["First", "Second"]);
  });

  it("throws descriptive errors on malformed or empty JSON/CSV", () => {
    expect(() => parseTemplateJson("{not json", "bad.json")).toThrow(
      /Invalid JSON/i,
    );
    expect(() => parseTemplateJson("[]", "empty.json")).toThrow(
      /No valid template buttons/i,
    );
    expect(() => parsePaletteCsv("title,speech", "Empty")).toThrow(
      /must include a header row and at least one button row/i,
    );
    expect(() =>
      parsePaletteCsv("title,speech,color\n,,Blue", "MissingTitleSpeech"),
    ).toThrow(/No valid button rows/i);
    expect(() => parseTemplateCsv("title,speech\n,", "blank.csv")).toThrow(
      /must include a header row and at least one button row/i,
    );
    expect(() =>
      parseTemplateCsv("title,speech,color\n,,Blue", "no-speech.csv"),
    ).toThrow(/No valid template buttons/i);
  });

  it("handles array-of-templates, wrapped templates array, duplicate flat IDs, and FileReader fallback", async () => {
    const wrappedTemplates = JSON.stringify({
      templates: [
        {
          title: "Pack A",
          buttons: [
            { id: "dup", title: "One", speech: "One" },
            { id: "dup", title: "Two", speech: "Two", keywords: "a;b,c" },
          ],
        },
        {
          title: "Pack B",
          options: [
            {
              type: "Message",
              labelColor: "Red",
              details: {
                title: "Canonical In Array",
                speech: "Hello",
                color: "Red",
                emotion: "Happy",
                isFallback: true,
              },
            },
          ],
        },
      ],
    });
    const parsedWrapped = parseTemplateJson(wrappedTemplates);
    expect(parsedWrapped).toHaveLength(2);
    expect(parsedWrapped[0].hierarchy.root).toEqual(["dup", "dup-2"]);
    expect(parsedWrapped[0].buttons["dup-2"].type).toBe("Message");
    if (parsedWrapped[0].buttons["dup-2"].type === "Message") {
      expect(parsedWrapped[0].buttons["dup-2"].details.keywords).toEqual([
        "a",
        "b",
        "c",
      ]);
    }

    const arrayOfTemplates = JSON.stringify([
      { title: "T1", buttons: [{ title: "A", speech: "A" }] },
      { title: "T2", messages: [{ name: "B", message: "B" }] },
    ]);
    expect(parseTemplateJson(arrayOfTemplates)).toHaveLength(2);
  });

  it("validates MAX_TEMPLATE_FILE_BYTES (2 MB) and parses .json and .csv Files in parseTemplateFile", async () => {
    const validJsonFile = new File(
      [
        JSON.stringify([
          { title: "Hi", speech: "Hello!", color: "Blue", emotion: "Happy" },
        ]),
      ],
      "valid.json",
      { type: "application/json" },
    );
    const jsonResult = await parseTemplateFile(validJsonFile);
    expect(jsonResult).toHaveLength(1);

    const validCsvFile = new File(
      ["title,speech,color,emotion\nWave,Hi!,Green,Happy"],
      "valid.csv",
      { type: "text/csv" },
    );
    const csvResult = await parseTemplateFile(validCsvFile);
    expect(csvResult).toHaveLength(1);

    const oversizedFile = new File(["{}"], "huge.json", {
      type: "application/json",
    });
    Object.defineProperty(oversizedFile, "size", {
      value: MAX_TEMPLATE_FILE_BYTES + 1,
    });
    await expect(parseTemplateFile(oversizedFile)).rejects.toThrow(
      /exceeds the 2 MB maximum allowed size/i,
    );
  });
});
