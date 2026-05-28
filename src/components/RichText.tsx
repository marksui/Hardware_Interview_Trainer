type RichTextBlock =
  | { kind: "text"; content: string }
  | { kind: "code"; content: string; language?: string };

type CodeTokenKind =
  | "plain"
  | "comment"
  | "keyword"
  | "number"
  | "operator"
  | "string"
  | "system"
  | "type";

interface CodeToken {
  kind: CodeTokenKind;
  value: string;
}

const tokenClassNames: Record<CodeTokenKind, string> = {
  plain: "",
  comment: "code-token-comment",
  keyword: "code-token-keyword",
  number: "code-token-number",
  operator: "code-token-operator",
  string: "code-token-string",
  system: "code-token-system",
  type: "code-token-type",
};

const rtlKeywords = new Set([
  "always",
  "always_comb",
  "always_ff",
  "assign",
  "begin",
  "case",
  "casez",
  "default",
  "else",
  "end",
  "endcase",
  "endfunction",
  "endmodule",
  "for",
  "function",
  "generate",
  "if",
  "initial",
  "localparam",
  "module",
  "negedge",
  "or",
  "parameter",
  "posedge",
  "return",
  "unique",
]);

const rtlTypes = new Set([
  "bit",
  "enum",
  "input",
  "integer",
  "logic",
  "output",
  "reg",
  "signed",
  "struct",
  "wire",
]);

const cppKeywords = new Set([
  "auto",
  "bool",
  "break",
  "case",
  "class",
  "const",
  "continue",
  "else",
  "false",
  "for",
  "if",
  "namespace",
  "private",
  "public",
  "return",
  "struct",
  "switch",
  "true",
  "using",
  "void",
  "while",
]);

const cppTypes = new Set([
  "deque",
  "greater",
  "int",
  "long",
  "map",
  "pair",
  "priority_queue",
  "queue",
  "set",
  "size_t",
  "stack",
  "string",
  "tuple",
  "unordered_map",
  "unordered_set",
  "unique_ptr",
  "vector",
]);

const pythonKeywords = new Set([
  "and",
  "as",
  "class",
  "continue",
  "def",
  "elif",
  "else",
  "False",
  "for",
  "from",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "None",
  "not",
  "or",
  "return",
  "True",
  "while",
  "with",
]);

const pythonTypes = new Set([
  "Counter",
  "defaultdict",
  "deque",
  "dict",
  "heapq",
  "int",
  "list",
  "set",
  "str",
  "tuple",
]);

function getCodeLanguage(language?: string) {
  return (language ?? "").toLowerCase();
}

function classifyWord(word: string, language?: string): CodeTokenKind {
  const normalizedLanguage = getCodeLanguage(language);

  if (word.startsWith("$")) {
    return "system";
  }

  if (normalizedLanguage === "python" || normalizedLanguage === "py") {
    if (pythonKeywords.has(word)) {
      return "keyword";
    }

    if (pythonTypes.has(word)) {
      return "type";
    }
  }

  if (
    normalizedLanguage === "cpp" ||
    normalizedLanguage === "c++" ||
    normalizedLanguage === "cc"
  ) {
    if (cppKeywords.has(word)) {
      return "keyword";
    }

    if (cppTypes.has(word)) {
      return "type";
    }
  }

  if (rtlKeywords.has(word)) {
    return "keyword";
  }

  if (rtlTypes.has(word)) {
    return "type";
  }

  return "plain";
}

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

function readPattern(content: string, index: number, pattern: RegExp) {
  const match = pattern.exec(content.slice(index));

  return match?.index === 0 ? match[0] : "";
}

function tokenizeCode(content: string, language?: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let index = 0;

  while (index < content.length) {
    const rest = content.slice(index);

    if (rest.startsWith("//")) {
      const end = content.indexOf("\n", index);
      const value = content.slice(index, end === -1 ? content.length : end);
      tokens.push({ kind: "comment", value });
      index += value.length;
      continue;
    }

    if (rest.startsWith("#")) {
      const end = content.indexOf("\n", index);
      const value = content.slice(index, end === -1 ? content.length : end);
      tokens.push({ kind: "comment", value });
      index += value.length;
      continue;
    }

    if (rest.startsWith("/*")) {
      const end = content.indexOf("*/", index + 2);
      const value = content.slice(index, end === -1 ? content.length : end + 2);
      tokens.push({ kind: "comment", value });
      index += value.length;
      continue;
    }

    if (rest[0] === '"' || rest[0] === "'") {
      const quote = rest[0];
      const match =
        quote === '"'
          ? /^"(?:\\.|[^"\\])*"/.exec(rest)
          : /^'(?:\\.|[^'\\])*'/.exec(rest);
      const value = match ? match[0] : rest[0];
      tokens.push({ kind: "string", value });
      index += value.length;
      continue;
    }

    const whitespace = readPattern(content, index, /^\s+/);

    if (whitespace) {
      tokens.push({ kind: "plain", value: whitespace });
      index += whitespace.length;
      continue;
    }

    const number = readPattern(
      content,
      index,
      /^(?:\d+)?'[sS]?[bBoOdDhH][0-9a-fA-F_xXzZ?]+|\d+(?:\.\d+)?/,
    );

    if (number) {
      tokens.push({ kind: "number", value: number });
      index += number.length;
      continue;
    }

    const word = readPattern(content, index, /^[A-Za-z_$][A-Za-z0-9_$]*/);

    if (word) {
      tokens.push({ kind: classifyWord(word, language), value: word });
      index += word.length;
      continue;
    }

    const operator = readPattern(content, index, /^[{}[\]();,:.#@?~!%^&*+\-=|<>/]+/);

    if (operator) {
      tokens.push({ kind: "operator", value: operator });
      index += operator.length;
      continue;
    }

    tokens.push({ kind: "plain", value: content[index] });
    index += 1;
  }

  return tokens;
}

function HighlightedCode({
  content,
  language,
}: {
  content: string;
  language?: string;
}) {
  return (
    <>
      {tokenizeCode(content, language).map((token, index) =>
        token.kind === "plain" ? (
          <span key={`${token.kind}-${index}`}>{token.value}</span>
        ) : (
          <span
            className={tokenClassNames[token.kind]}
            key={`${token.kind}-${index}`}
          >
            {token.value}
          </span>
        ),
      )}
    </>
  );
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
            className="code-block"
            key={`${block.kind}-${index}`}
          >
            <code>
              <HighlightedCode
                content={block.content}
                language={block.language}
              />
            </code>
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
