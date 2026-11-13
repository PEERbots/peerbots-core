import { describe, expect, it } from "vitest";
import {
  EXAMPLE_LEGACY_PALETTE_CSV,
  EXAMPLE_MODERN_PALETTE_CSV,
  EXAMPLE_PALETTE,
  LEGACY_PALETTE_CSV_HEADERS,
  MODERN_PALETTE_CSV_HEADERS,
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  colorToLegacyIndex,
  convertPaletteToCSV,
  convertPaletteToTemplate,
  convertTemplateToPalette,
  detectCsvFormat,
  emotionToLegacyIndex,
  extractMessageButtons,
  normalizeColorName,
  normalizeEmotion,
  normalizePeerbotsColor,
  parseCsvRows,
  parseLegacyCsvToTemplate,
  parsePaletteCsv,
  parsePaletteCsvToTemplate,
  parseTemplateCsv,
  serializeCsvRows,
  serializePaletteCsv,
  type Palette,
  type Template,
} from "../index";

describe("palette_converters (ported from app.peerbots.org + hierarchy/Log extensions)", () => {
  const mockPalette: Palette = {
    title: "Test Palette",
    buttons: [
      {
        title: "Button 1",
        speech: "Hello",
        color: "Blue",
        emotion: "Happy",
        goal: "Goal 1",
        subgoal: "Subgoal 1",
        proficiency: "None",
      },
    ],
  };

  it("should convert palette to template correctly", () => {
    const template = convertPaletteToTemplate(mockPalette);
    expect(template.title).toBe(mockPalette.title);
    expect(template.buttons["0"].details.title).toBe("Button 1");
    expect(template.buttons["0"].details.metadata?.goal).toBe("Goal 1");
    expect(template.hierarchy.root).toContain("0");
  });

  it("should convert template back to palette correctly", () => {
    const template = convertPaletteToTemplate(mockPalette);
    const palette = convertTemplateToPalette(template);
    expect(palette.title).toBe(mockPalette.title);
    expect(palette.buttons[0].title).toBe("Button 1");
    expect(palette.buttons[0].goal).toBe("Goal 1");
  });

  it("should handle empty palettes", () => {
    const emptyPalette: Palette = { title: "Empty", buttons: [] };
    const template = convertPaletteToTemplate(emptyPalette);
    expect(template.hierarchy.root).toHaveLength(0);
    expect(Object.keys(template.buttons)).toHaveLength(0);
  });

  it("flattens nested and cyclic hierarchies and converts Log buttons when building a Palette", () => {
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
        root: ["intro", "logStep", "missingBtn"],
        intro: ["followup"],
        followup: ["intro"],
      },
    };

    const palette = convertTemplateToPalette(nestedTemplate);
    expect(palette.buttons.map((b) => b.title)).toEqual([
      "Intro",
      "Follow-up",
      "Observation",
    ]);
    expect(palette.buttons[0].goal).toBe("Engagement");
    expect(palette.buttons[1].goal).toBe("None");
    expect(palette.buttons[2].color).toBe("Light Blue");
    expect(palette.buttons[2].speech).toBe("Child smiled");
  });
});

describe("color & emotion normalization and legacy 0-7 index helpers", () => {
  it("normalizes all 11 canonical Peerbots colors case-insensitively plus 'gray' and 'lightblue' aliases", () => {
    expect(normalizeColorName).toBe(normalizePeerbotsColor);
    for (const color of PEERBOTS_COLORS) {
      expect(normalizePeerbotsColor(color)).toBe(color);
      expect(normalizePeerbotsColor(`  ${color.toLowerCase()}  `)).toBe(color);
      expect(normalizeColorName(color.toUpperCase())).toBe(color);
    }
    expect(normalizePeerbotsColor("gray")).toBe("Grey");
    expect(normalizePeerbotsColor("GRAY")).toBe("Grey");
    expect(normalizePeerbotsColor("lightblue")).toBe("Light Blue");
    expect(normalizePeerbotsColor("light-blue")).toBe("Light Blue");
  });

  it("normalizes numeric color codes 0-10 and defaults out-of-range/invalid inputs to Light Blue", () => {
    const expected = [
      "Light Blue",
      "Blue",
      "Green",
      "Red",
      "Purple",
      "Pink",
      "Yellow",
      "Orange",
      "Grey",
      "Black",
      "White",
    ] as const;
    expected.forEach((color, index) => {
      expect(normalizePeerbotsColor(index)).toBe(color);
      expect(normalizePeerbotsColor(String(index))).toBe(color);
    });

    expect(normalizePeerbotsColor(-1)).toBe("Light Blue");
    expect(normalizePeerbotsColor(11)).toBe("Light Blue");
    expect(normalizePeerbotsColor(99)).toBe("Light Blue");
    expect(normalizePeerbotsColor(1.5)).toBe("Light Blue");
    expect(normalizePeerbotsColor(Number.NaN)).toBe("Light Blue");
    expect(normalizePeerbotsColor("-2")).toBe("Light Blue");
    expect(normalizePeerbotsColor("Unknown")).toBe("Light Blue");
    expect(normalizePeerbotsColor("")).toBe("Light Blue");
    expect(normalizePeerbotsColor(null)).toBe("Light Blue");
    expect(normalizePeerbotsColor(undefined)).toBe("Light Blue");
  });

  it.each([
    ["Light Blue", 0],
    ["Blue", 1],
    ["Green", 2],
    ["Red", 3],
    ["Purple", 4],
    ["Pink", 5],
    ["Yellow", 6],
    ["Orange", 7],
    ["Grey", 0],
    ["Black", 0],
    ["White", 0],
  ] as const)(
    "colorToLegacyIndex(%s) returns %i",
    (colorName, expectedIndex) => {
      expect(colorToLegacyIndex(colorName)).toBe(expectedIndex);
    },
  );

  it("defaults unknown, null, undefined, and out-of-range color inputs in colorToLegacyIndex to 0", () => {
    expect(colorToLegacyIndex("gray")).toBe(0);
    expect(colorToLegacyIndex(8)).toBe(0);
    expect(colorToLegacyIndex(99)).toBe(0);
    expect(colorToLegacyIndex("Unknown")).toBe(0);
    expect(colorToLegacyIndex(null)).toBe(0);
    expect(colorToLegacyIndex(undefined)).toBe(0);
  });

  it("normalizes all 6 emotions, 'Sleep'/'sleeping' aliases, and numeric codes 0-7", () => {
    for (const emotion of PEERBOTS_EMOTIONS) {
      expect(normalizeEmotion(emotion)).toBe(emotion);
      expect(normalizeEmotion(` ${emotion.toLowerCase()} `)).toBe(emotion);
    }
    expect(normalizeEmotion("Sleep")).toBe("Sleepy");
    expect(normalizeEmotion("sleep")).toBe("Sleepy");
    expect(normalizeEmotion("sleeping")).toBe("Sleepy");

    expect(normalizeEmotion(0)).toBe("Neutral");
    expect(normalizeEmotion("1")).toBe("Surprised");
    expect(normalizeEmotion(2)).toBe("Happy");
    expect(normalizeEmotion("3")).toBe("Sad");
    expect(normalizeEmotion(4)).toBe("Concerned");
    expect(normalizeEmotion("5")).toBe("Sleepy");
    expect(normalizeEmotion(6)).toBe("Neutral");
    expect(normalizeEmotion(7)).toBe("Neutral");
    expect(normalizeEmotion(8)).toBe("Neutral");
    expect(normalizeEmotion(-1)).toBe("Neutral");
    expect(normalizeEmotion(2.5)).toBe("Neutral");
    expect(normalizeEmotion("Unknown")).toBe("Neutral");
    expect(normalizeEmotion("")).toBe("Neutral");
    expect(normalizeEmotion(null)).toBe("Neutral");
    expect(normalizeEmotion(undefined)).toBe("Neutral");
  });

  it.each([
    ["Neutral", 0],
    ["Surprised", 1],
    ["Happy", 2],
    ["Sad", 3],
    ["Concerned", 4],
    ["Sleepy", 5],
  ] as const)(
    "emotionToLegacyIndex(%s) returns %i",
    (emotionName, expectedIndex) => {
      expect(emotionToLegacyIndex(emotionName)).toBe(expectedIndex);
    },
  );

  it("maps Sleep alias to 5 and defaults unknown/null/undefined emotions in emotionToLegacyIndex to 0", () => {
    expect(emotionToLegacyIndex("Sleep")).toBe(5);
    expect(emotionToLegacyIndex(6)).toBe(0);
    expect(emotionToLegacyIndex("Unknown")).toBe(0);
    expect(emotionToLegacyIndex(null)).toBe(0);
    expect(emotionToLegacyIndex(undefined)).toBe(0);
  });
});

describe("RFC-4180 CSV parsing, format detection, empty-cell fallbacks, and modern/legacy round-trips", () => {
  it("detects modern, legacy, and generic CSV header formats", () => {
    expect(detectCsvFormat(EXAMPLE_MODERN_PALETTE_CSV)).toBe("modern");
    expect(detectCsvFormat(EXAMPLE_LEGACY_PALETTE_CSV)).toBe("legacy");
    expect(detectCsvFormat(`\uFEFF${EXAMPLE_LEGACY_PALETTE_CSV}`)).toBe(
      "legacy",
    );
    expect(detectCsvFormat("title,speech\nHello,Hi there")).toBe("generic");
    expect(detectCsvFormat("   ")).toBe("generic");
  });

  it("handles escaped quotes (\"\"), embedded commas, multiline quoted speech, LF/CRLF, BOM, and blank rows", () => {
    const complexCsv = [
      "\uFEFFtitle,color,emotion,speech,goal,subgoal,proficiency",
      '"Greet, ""Hugo""",Yellow,Happy,"Line 1\nLine 2, with comma",Social,Greeting,1',
      "   ,   ,   ,   ,   ,   ,   ",
      "",
      "Calm,Blue,Concerned,Take a breath,Regulation,Breathing,2",
    ].join("\n");

    const rows = parseCsvRows(complexCsv);
    expect(rows).toHaveLength(3);
    expect(rows[1][0]).toBe('Greet, "Hugo"');
    expect(rows[1][3]).toBe("Line 1\nLine 2, with comma");

    const reserialized = serializeCsvRows(rows[0], rows.slice(1));
    expect(parseCsvRows(reserialized)).toEqual(rows);
  });

  it("throws descriptive error on unclosed CSV quotes", () => {
    expect(() =>
      parseCsvRows('title,speech\n"Unterminated quote,hello'),
    ).toThrow(/Malformed CSV/i);
  });

  it("inherits speech when title cell is empty string and inherits title when speech cell is empty string", () => {
    const csvWithPartialCells = [
      "title,color,emotion,speech,goal,subgoal,proficiency",
      '"",Green,Happy,"Hello from speech only!",Social,Greet,1',
      '"Title only prompt",Purple,Surprised,"",Social,React,1',
      '"",Red,Sad,"",None,None,None',
    ].join("\r\n");

    // 1. parsePaletteCsv
    const palette = parsePaletteCsv(csvWithPartialCells, "Partial Cells");
    expect(palette.buttons).toHaveLength(2);
    expect(palette.buttons[0].title).toBe("Hello from speech only!");
    expect(palette.buttons[0].speech).toBe("Hello from speech only!");
    expect(palette.buttons[1].title).toBe("Title only prompt");
    expect(palette.buttons[1].speech).toBe("Title only prompt");

    // 2. parseTemplateCsv (exercises normalizeFlatButtonItem with "" cells)
    const templates = parseTemplateCsv(csvWithPartialCells, "partial.csv");
    const extracted = extractMessageButtons(templates[0]);
    expect(extracted).toHaveLength(2);
    expect(extracted[0].details.title).toBe("Hello from speech only!");
    expect(extracted[0].details.speech).toBe("Hello from speech only!");
    expect(extracted[1].details.title).toBe("Title only prompt");
    expect(extracted[1].details.speech).toBe("Title only prompt");
  });

  it("emits numeric 0-7 color & emotion indices in legacy CSV serialization and round-trips cleanly", () => {
    const legacyCsv = serializePaletteCsv(EXAMPLE_PALETTE, {
      format: "legacy",
    });
    const parsedRows = parseCsvRows(legacyCsv);
    expect(parsedRows[0]).toEqual([...LEGACY_PALETTE_CSV_HEADERS]);

    // Row 1: Light Blue (0), Happy (2)
    expect(parsedRows[1][1]).toBe("0");
    expect(parsedRows[1][2]).toBe("2");
    // Row 2: Green (2), Happy (2)
    expect(parsedRows[2][1]).toBe("2");
    expect(parsedRows[2][2]).toBe("2");
    // Row 3: Purple (4), Concerned (4)
    expect(parsedRows[3][1]).toBe("4");
    expect(parsedRows[3][2]).toBe("4");
    // Row 4: Yellow (6), Sleepy (5)
    expect(parsedRows[4][1]).toBe("6");
    expect(parsedRows[4][2]).toBe("5");

    const roundTripped = parsePaletteCsv(legacyCsv, EXAMPLE_PALETTE.title);
    expect(roundTripped).toEqual(EXAMPLE_PALETTE);
  });

  it("round-trips modern Palette CSV and converts via parsePaletteCsvToTemplate & parseLegacyCsvToTemplate", () => {
    const modernCsv = convertPaletteToCSV(EXAMPLE_PALETTE);
    expect(modernCsv.split("\r\n")[0]).toBe(
      MODERN_PALETTE_CSV_HEADERS.join(","),
    );
    expect(parsePaletteCsv(modernCsv, EXAMPLE_PALETTE.title)).toEqual(
      EXAMPLE_PALETTE,
    );

    const tplModern = parsePaletteCsvToTemplate(modernCsv, "From Modern");
    const tplLegacy = parseLegacyCsvToTemplate(
      EXAMPLE_LEGACY_PALETTE_CSV,
      "From Legacy",
    );
    expect(tplModern.title).toBe("From Modern");
    expect(tplLegacy.title).toBe("From Legacy");
    expect(tplModern.buttons).toEqual(tplLegacy.buttons);
    expect(tplModern.hierarchy.root).toEqual(["0", "1", "2", "3"]);
  });

  it("throws on header-only or completely empty-button CSVs", () => {
    expect(() => parsePaletteCsv("title,speech", "HeaderOnly")).toThrow(
      /must include a header row and at least one button row/i,
    );
    expect(() =>
      parsePaletteCsv("title,speech,color\n,,Blue", "NoButtons"),
    ).toThrow(/No valid button rows/i);
    expect(() => parseTemplateCsv("title,speech\n,", "blank.csv")).toThrow(
      /must include a header row and at least one button row/i,
    );
    expect(() =>
      parseTemplateCsv("title,speech,color\n,,Blue", "no-speech.csv"),
    ).toThrow(/No valid template buttons/i);
  });

  it("handles bare CR line endings, short/ragged rows, case-insensitive headers, and agent CSV columns", () => {
    const crCsv =
      "ID,TITLE,SPEECH,COLOR,EMOTION,CATEGORY,KEYWORDS,ISFALLBACK\rbtn-1,Hi,Hello!,2,2,Greet,hi;hello,false\rbtn-2,,Repeat please";
    const [tpl] = parseTemplateCsv(crCsv, "agent-cr.csv", {
      generateMissingIds: true,
    });
    expect(tpl.id).toBe("agent-cr");
    expect(tpl.hierarchy.root).toEqual(["btn-1", "btn-2"]);
    const extracted = extractMessageButtons(tpl);
    expect(extracted[0].details.color).toBe("Green");
    expect(extracted[0].details.emotion).toBe("Happy");
    expect(extracted[0].details.category).toBe("Greet");
    expect(extracted[0].details.keywords).toEqual(["hi", "hello"]);
    expect(extracted[1].details.title).toBe("Repeat please");
  });
});
