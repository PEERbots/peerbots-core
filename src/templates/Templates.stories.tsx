import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  CodeBlock,
  Heading,
  PEERBOTS_COLOR_MAP,
  PEERBOTS_FONT_COLOR_MAP,
  Switch,
  TabRadio,
  Text,
  TextArea,
} from "../ui";
import {
  DEFAULT_BULK_AUTHOR_OPTIONS,
  EXAMPLE_LOG_AND_SPEAK_TEMPLATE,
  EXAMPLE_PALETTE_TEMPLATE,
  EXAMPLE_QA_AND_COLORS_TEMPLATE,
  EXAMPLE_STARTER_SOCIAL_TEMPLATE,
  convertPaletteToCSV,
  convertTemplateToPalette,
  extractMessageButtons,
  flattenHierarchy,
  getParentMap,
  processBulkAuthorContent,
  reorderHierarchySiblings,
  serializeTemplateJson,
  type BulkAuthorOptions,
  type Template,
} from "./index";

type ExampleKey = "qa_colors" | "starter_social" | "log_and_speak" | "palette";
type OutputFormat = "json" | "modern_csv" | "legacy_csv";

const EXAMPLE_MAP: Record<ExampleKey, Template> = {
  qa_colors: EXAMPLE_QA_AND_COLORS_TEMPLATE,
  starter_social: EXAMPLE_STARTER_SOCIAL_TEMPLATE,
  log_and_speak: EXAMPLE_LOG_AND_SPEAK_TEMPLATE,
  palette: EXAMPLE_PALETTE_TEMPLATE,
};

function CanonicalTemplatesShowcase() {
  const [selectedExample, setSelectedExample] =
    useState<ExampleKey>("qa_colors");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("json");
  const [customHierarchies, setCustomHierarchies] = useState<
    Partial<Record<ExampleKey, Template["hierarchy"]>>
  >({});

  const activeTemplate = useMemo<Template>(() => {
    const base = EXAMPLE_MAP[selectedExample];
    const overrideHierarchy = customHierarchies[selectedExample];
    return overrideHierarchy ? { ...base, hierarchy: overrideHierarchy } : base;
  }, [selectedExample, customHierarchies]);

  const flattened = useMemo(
    () => flattenHierarchy(activeTemplate.hierarchy),
    [activeTemplate.hierarchy],
  );
  const parentMap = useMemo(
    () => getParentMap(activeTemplate.hierarchy),
    [activeTemplate.hierarchy],
  );
  const extractedMessages = useMemo(
    () => extractMessageButtons(activeTemplate),
    [activeTemplate],
  );

  const liveSerializedOutput = useMemo(() => {
    if (outputFormat === "json") {
      return serializeTemplateJson(activeTemplate, true);
    }
    const palette = convertTemplateToPalette(activeTemplate);
    if (outputFormat === "legacy_csv") {
      return convertPaletteToCSV(palette, { format: "legacy" });
    }
    return convertPaletteToCSV(palette, { format: "modern" });
  }, [activeTemplate, outputFormat]);

  const handleMove = (buttonId: string, direction: "BACK" | "FORWARD") => {
    setCustomHierarchies((prev) => ({
      ...prev,
      [selectedExample]: reorderHierarchySiblings(
        activeTemplate.hierarchy,
        buttonId,
        direction,
      ),
    }));
  };

  return (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4 pb:max-w-6xl">
      <div className="pb:flex pb:flex-col pb:gap-2">
        <Heading level={2} size={4}>
          Peerbots Canonical Templates &amp; Live IO Explorer
        </Heading>
        <Text size="sm" color="muted">
          Inspect canonical Template schemas, cycle-safe DFS hierarchy
          flattening, sibling reordering, message extraction, and RFC-4180 CSV /
          JSON serialization.
        </Text>
      </div>

      <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-3">
        <TabRadio
          aria-label="Select canonical template example"
          value={selectedExample}
          onChange={(val) => {
            if (val) setSelectedExample(val);
          }}
          options={[
            { value: "qa_colors", label: "Q&A + 11 Colors" },
            { value: "starter_social", label: "Starter Social" },
            { value: "log_and_speak", label: "Speak + Log" },
            { value: "palette", label: "Palette Template" },
          ]}
        />
        <Text size="xs" color="muted">
          Total Buttons: <strong>{flattened.length}</strong> | Speakable Message
          Buttons: <strong>{extractedMessages.length}</strong>
        </Text>
      </div>

      <div className="pb:grid pb:grid-cols-1 lg:pb:grid-cols-2 pb:gap-6">
        <Card hoverable={false} padding="sm" className="pb:flex pb:flex-col pb:gap-3">
          <div className="pb:flex pb:items-center pb:justify-between">
            <Heading level={3} size={6}>
              Hierarchy Flattening ({activeTemplate.title})
            </Heading>
            {customHierarchies[selectedExample] && (
              <Button
                size="xs"
                variant="secondary"
                onClick={() =>
                  setCustomHierarchies((prev) => {
                    const next = { ...prev };
                    delete next[selectedExample];
                    return next;
                  })
                }
              >
                Reset Order
              </Button>
            )}
          </div>

          <div className="pb:flex pb:flex-col pb:gap-2 pb:max-h-[460px] pb:overflow-y-auto pb:pe-1">
            {flattened.map(({ buttonId, depth }) => {
              const btn = activeTemplate.buttons[buttonId];
              if (!btn) return null;
              const parentId = parentMap[buttonId];
              const swatchColor =
                btn.type === "Message" ? btn.details.color : btn.labelColor;
              const bgHex = PEERBOTS_COLOR_MAP[swatchColor];
              const fgHex = PEERBOTS_FONT_COLOR_MAP[swatchColor];

              return (
                <div
                  key={buttonId}
                  style={{ marginInlineStart: `${depth * 20}px` }}
                  className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:rounded-lg pb:border pb:border-gray-200 pb:bg-gray-50 pb:px-3 pb:py-2"
                >
                  <div className="pb:flex pb:items-center pb:gap-2.5 pb:min-w-0">
                    <span
                      aria-hidden="true"
                      style={{ backgroundColor: bgHex, color: fgHex }}
                      className="pb:inline-flex pb:h-6 pb:w-6 pb:shrink-0 pb:items-center pb:justify-center pb:rounded-full pb:border pb:border-gray-400 pb:text-[10px] pb:font-bold"
                    >
                      {depth}
                    </span>
                    <div className="pb:min-w-0">
                      <div className="pb:flex pb:flex-wrap pb:items-center pb:gap-1.5">
                        <span className="pb:text-sm pb:font-semibold pb:text-gray-900">
                          {btn.details.title}
                        </span>
                        <span className="pb:rounded pb:bg-gray-200 pb:px-1.5 pb:py-0.5 pb:text-[11px] pb:font-medium pb:text-gray-800">
                          {btn.type}
                        </span>
                        {btn.type === "Message" && (
                          <span className="pb:rounded pb:bg-sky-100 pb:px-1.5 pb:py-0.5 pb:text-[11px] pb:font-medium pb:text-sky-900">
                            {btn.details.emotion}
                          </span>
                        )}
                        {btn.type === "Message" && btn.details.isFallback && (
                          <span className="pb:rounded pb:bg-amber-100 pb:px-1.5 pb:py-0.5 pb:text-[11px] pb:font-semibold pb:text-amber-900">
                            Fallback
                          </span>
                        )}
                      </div>
                      <p className="pb:truncate pb:text-xs pb:text-gray-700">
                        {btn.type === "Message"
                          ? btn.details.speech
                          : (btn.details.details ?? "")}
                        {parentId ? ` (parent: ${parentId})` : " (root)"}
                      </p>
                    </div>
                  </div>

                  <div className="pb:flex pb:items-center pb:gap-1 pb:shrink-0">
                    <Button
                      size="xs"
                      variant="secondary"
                      aria-label={`Move ${btn.details.title} up`}
                      onClick={() => handleMove(buttonId, "BACK")}
                    >
                      ↑
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      aria-label={`Move ${btn.details.title} down`}
                      onClick={() => handleMove(buttonId, "FORWARD")}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card hoverable={false} padding="sm" className="pb:flex pb:flex-col pb:gap-3">
          <div className="pb:flex pb:flex-wrap pb:items-center pb:justify-between pb:gap-2">
            <Heading level={3} size={6}>
              Live Serialized Output
            </Heading>
            <TabRadio
              aria-label="Select output serialization format"
              value={outputFormat}
              onChange={(val) => {
                if (val) setOutputFormat(val);
              }}
              options={[
                { value: "json", label: "Template JSON" },
                { value: "modern_csv", label: "Modern CSV" },
                { value: "legacy_csv", label: "Legacy (0-7) CSV" },
              ]}
            />
          </div>

          <CodeBlock
            code={liveSerializedOutput}
            language={outputFormat === "json" ? "json" : "csv"}
            fileName={
              outputFormat === "json"
                ? `${activeTemplate.title}.json`
                : outputFormat === "legacy_csv"
                  ? `${activeTemplate.title}.legacy.csv`
                  : `${activeTemplate.title}.csv`
            }
            variant="window"
            className="pb:max-h-[460px] pb:overflow-y-auto"
          />
        </Card>
      </div>
    </div>
  );
}

const SAMPLE_SCRIPT = [
  ":) Greeting: Hi there! Ready to play a word game?",
  "Question 1: Can you think of an animal that hops?",
  ":o Amazed: Whoa, kangaroos and frogs both hop super high!",
  ":z Rest Prompt: Let us take a calm, quiet breath before the next round.",
].join("\n");

function BulkAuthorPlaygroundShowcase() {
  const [script, setScript] = useState<string>(SAMPLE_SCRIPT);
  const [options, setOptions] = useState<BulkAuthorOptions>({
    ...DEFAULT_BULK_AUTHOR_OPTIONS,
    parseTitlesAndSpeech: true,
    detectEmotionAtStart: true,
    addFeedbackAfterQuestions: true,
  });

  const generated = useMemo(
    () => processBulkAuthorContent(script, options),
    [script, options],
  );

  const generatedTemplate: Template = useMemo(
    () => ({
      title: "Bulk Authored Preview",
      buttons: generated.buttons,
      hierarchy: generated.hierarchy,
    }),
    [generated],
  );

  return (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4 pb:max-w-6xl">
      <div className="pb:flex pb:flex-col pb:gap-2">
        <Heading level={2} size={4}>
          Bulk Authoring Engine Playground
        </Heading>
        <Text size="sm" color="muted">
          Type multi-line or sentence-delimited dialogue scripts with optional{" "}
          <code>:) :( :/ :o :z</code> emotion prefixes and{" "}
          <code>Title: Speech</code> delimiters.
        </Text>
      </div>

      <div className="pb:grid pb:grid-cols-1 lg:pb:grid-cols-2 pb:gap-6">
        <Card hoverable={false} padding="sm" className="pb:flex pb:flex-col pb:gap-4">
          <div className="pb:flex pb:flex-col pb:gap-1.5">
            <label
              htmlFor="bulk-author-script-input"
              className="pb:text-sm pb:font-semibold pb:text-gray-900"
            >
              Dialogue Script
            </label>
            <TextArea
              id="bulk-author-script-input"
              rows={6}
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
          </div>

          <div className="pb:flex pb:items-center pb:justify-between pb:gap-2">
            <span className="pb:text-sm pb:font-medium pb:text-gray-900">
              Split Mode
            </span>
            <TabRadio
              aria-label="Select button formation split mode"
              value={options.formButtonsOn}
              onChange={(val) => {
                if (val) {
                  setOptions((prev) => ({ ...prev, formButtonsOn: val }));
                }
              }}
              options={[
                { value: "New Lines", label: "New Lines" },
                { value: "Sentences", label: "Sentences" },
              ]}
            />
          </div>

          <div className="pb:grid pb:grid-cols-1 sm:pb:grid-cols-2 pb:gap-3">
            <label
              htmlFor="opt-parse-titles"
              className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:text-sm pb:text-gray-900"
            >
              <span>Parse Title: Speech</span>
              <Switch
                id="opt-parse-titles"
                checked={options.parseTitlesAndSpeech}
                onChange={(checked) =>
                  setOptions((prev) => ({
                    ...prev,
                    parseTitlesAndSpeech: checked,
                  }))
                }
              />
            </label>

            <label
              htmlFor="opt-detect-emotion"
              className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:text-sm pb:text-gray-900"
            >
              <span>Detect Emotion Prefix</span>
              <Switch
                id="opt-detect-emotion"
                checked={options.detectEmotionAtStart}
                onChange={(checked) =>
                  setOptions((prev) => ({
                    ...prev,
                    detectEmotionAtStart: checked,
                  }))
                }
              />
            </label>

            <label
              htmlFor="opt-trim-title"
              className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:text-sm pb:text-gray-900"
            >
              <span>Trim Title (20 chars)</span>
              <Switch
                id="opt-trim-title"
                checked={options.trimTitle}
                onChange={(checked) =>
                  setOptions((prev) => ({ ...prev, trimTitle: checked }))
                }
              />
            </label>

            <label
              htmlFor="opt-chunk-long"
              className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:text-sm pb:text-gray-900"
            >
              <span>Chunk Long Lines</span>
              <Switch
                id="opt-chunk-long"
                checked={options.breakUpLongSentences}
                onChange={(checked) =>
                  setOptions((prev) => ({
                    ...prev,
                    breakUpLongSentences: checked,
                  }))
                }
              />
            </label>

            <label
              htmlFor="opt-question-feedback"
              className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:text-sm pb:text-gray-900 sm:pb:col-span-2"
            >
              <span>Insert Feedback Buttons After Questions (?)</span>
              <Switch
                id="opt-question-feedback"
                checked={options.addFeedbackAfterQuestions}
                onChange={(checked) =>
                  setOptions((prev) => ({
                    ...prev,
                    addFeedbackAfterQuestions: checked,
                  }))
                }
              />
            </label>
          </div>
        </Card>

        <Card hoverable={false} padding="sm" className="pb:flex pb:flex-col pb:gap-3">
          <Heading level={3} size={6}>
            Generated Buttons ({generated.hierarchy.root.length})
          </Heading>

          <div className="pb:flex pb:flex-col pb:gap-2 pb:max-h-[260px] pb:overflow-y-auto">
            {generated.hierarchy.root.map((id, idx) => {
              const btn = generated.buttons[id];
              if (!btn || btn.type !== "Message") return null;
              return (
                <div
                  key={id}
                  className="pb:flex pb:items-center pb:justify-between pb:gap-2 pb:rounded-lg pb:border pb:border-gray-200 pb:bg-gray-50 pb:px-3 pb:py-2"
                >
                  <div className="pb:min-w-0">
                    <div className="pb:flex pb:items-center pb:gap-2">
                      <span className="pb:text-xs pb:font-bold pb:text-gray-600">
                        #{idx + 1}
                      </span>
                      <span className="pb:text-sm pb:font-semibold pb:text-gray-900">
                        {btn.details.title}
                      </span>
                      <span className="pb:rounded pb:bg-sky-100 pb:px-1.5 pb:py-0.5 pb:text-[11px] pb:font-medium pb:text-sky-900">
                        {btn.details.emotion}
                      </span>
                    </div>
                    <p className="pb:text-xs pb:text-gray-700">
                      {btn.details.speech}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <CodeBlock
            code={serializeTemplateJson(generatedTemplate, true)}
            language="json"
            fileName="bulk-authored-preview.json"
            variant="window"
            className="pb:max-h-[220px] pb:overflow-y-auto"
          />
        </Card>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Templates/Schema & IO",
};

export default meta;
type Story = StoryObj;

export const CanonicalExamplesExplorer: Story = {
  render: () => <CanonicalTemplatesShowcase />,
};

export const BulkAuthoringPlayground: Story = {
  render: () => <BulkAuthorPlaygroundShowcase />,
};
