type RichTextBlock =
  | { kind: "text"; content: string }
  | { kind: "code"; content: string; language?: string };

function parseRichText(text: string): RichTextBlock[] {
  const blocks: RichTextBlock[] = [];
  const codeFencePattern = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeFencePattern.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index).trim();

    if (before) {
      blocks.push({ kind: "text", content: before });
    }

    blocks.push({
      kind: "code",
      language: match[1],
      content: match[2].trim(),
    });
    lastIndex = codeFencePattern.lastIndex;
  }

  const after = text.slice(lastIndex).trim();

  if (after) {
    blocks.push({ kind: "text", content: after });
  }

  return blocks.length ? blocks : [{ kind: "text", content: text }];
}

export function RichText({
  text,
  textClassName = "text-sm leading-6 text-body",
}: {
  text: string;
  textClassName?: string;
}) {
  return (
    <div className="space-y-3">
      {parseRichText(text).map((block, index) =>
        block.kind === "code" ? (
          <pre
            className="overflow-x-auto rounded-md border border-hairline bg-surface-soft p-3 font-code text-xs leading-5 text-primary"
            key={`${block.kind}-${index}`}
          >
            <code>{block.content}</code>
          </pre>
        ) : (
          <p
            className={`${textClassName} whitespace-pre-line`}
            key={`${block.kind}-${index}`}
          >
            {block.content}
          </p>
        ),
      )}
    </div>
  );
}
