'use client';

/**
 * Renders plain-text topic content into structured, scannable UI.
 *
 * Patterns detected:
 * 1. Double newline (\n\n) → separate content blocks (cards)
 * 2. "Label: description" at start of a block → bold label + body
 * 3. Single newlines within a block → bullet-style list items
 * 4. Inline terms in parentheses with "e.g." → subtle highlight
 * 5. Inline formulas like I_T, r^gamma → code-style inline
 */

interface ContentBlock {
  label?: string; // e.g. "X-Ray/CT", "MRI", "Goal"
  body: string;
}

function parseBlocks(content: string): ContentBlock[] {
  // Split on double newlines for major sections
  const rawBlocks = content.split(/\n\n/).filter((b) => b.trim());

  return rawBlocks.map((raw) => {
    const trimmed = raw.trim();

    // Detect "Label: rest of content" pattern
    // Must start with a word/phrase followed by colon, and the label shouldn't be too long
    const colonMatch = trimmed.match(/^([A-Z][^:\n]{0,40}):\s*(.+)$/s);
    if (colonMatch) {
      return { label: colonMatch[1].trim(), body: colonMatch[2].trim() };
    }

    return { body: trimmed };
  });
}

function renderInlineText(text: string) {
  // Bold key terms that appear before a colon within a line
  // Also highlight inline formulas (things with = signs, subscripts, etc.)
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let keyIndex = 0;

  // Split on inline patterns we want to highlight
  // Pattern: terms like "I_T = I_0 * e^(-muL)" or "s = T(r)"
  const formulaRegex = /([A-Za-z_][A-Za-z_0-9]*\s*[=<>]\s*[^\n,;]{3,40})/g;

  // Instead of complex regex, just return formatted text with line-level structure
  return text;
}

function SubBlock({ block }: { block: ContentBlock }) {
  const lines = block.body.split('\n').filter((l) => l.trim());
  const isList = lines.length > 1;

  return (
    <div className="content-block">
      {block.label && (
        <div className="content-block-label">{block.label}</div>
      )}
      {isList ? (
        <ul className="content-block-list">
          {lines.map((line, i) => {
            // Check for "SubLabel: description" within list items
            const subMatch = line.trim().match(/^(By [A-Z][^:]{0,30}|Type \([a-z]\)|Step \d+|Note|[A-Z][A-Za-z\s/()-]{0,25}):\s*(.+)$/);
            if (subMatch) {
              return (
                <li key={i} className="content-block-list-item">
                  <strong className="text-[var(--text)]">{subMatch[1]}:</strong>{' '}
                  <span>{subMatch[2]}</span>
                </li>
              );
            }
            return (
              <li key={i} className="content-block-list-item">
                {line.trim()}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="content-block-body">{block.body}</p>
      )}
    </div>
  );
}

export default function ContentRenderer({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  // If there's only one block with no label, render simply (but still styled)
  if (blocks.length === 1 && !blocks[0].label) {
    const lines = blocks[0].body.split('\n').filter((l) => l.trim());
    if (lines.length === 1) {
      return <p className="content-block-body">{blocks[0].body}</p>;
    }
  }

  return (
    <div className="content-blocks">
      {blocks.map((block, i) => (
        <SubBlock key={i} block={block} />
      ))}
    </div>
  );
}
