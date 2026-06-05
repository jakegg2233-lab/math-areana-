import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  text: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text }) => {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    // Normalize double backslashes (often produced by stringified JSON escapes) to single backslashes
    const normalizedText = text.replace(/\\\\/g, "\\");

    // Split text by block math ($$) first, then by inline math ($)
    const blocks = normalizedText.split("$$");
    return blocks.map((block, bIdx) => {
      // Even indices are text or inline math; odd indices are pure block math
      if (bIdx % 2 !== 0) {
        try {
          const html = katex.renderToString(block, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <div
              key={`block-${bIdx}`}
              className="my-4 overflow-x-auto select-none font-mono text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.25)] text-center text-lg md:text-xl"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (err) {
          return <pre key={`block-err-${bIdx}`} className="text-red-400">{block}</pre>;
        }
      }

      // Handle inline math ($) in even blocks
      const inlineParts = block.split("$");
      return (
        <span key={`text-block-${bIdx}`} className="leading-relaxed">
          {inlineParts.map((part, pIdx) => {
            if (pIdx % 2 !== 0) {
              try {
                const html = katex.renderToString(part, {
                  displayMode: false,
                  throwOnError: false,
                });
                return (
                  <span
                    key={`inline-${pIdx}`}
                    className="inline select-none font-mono text-cyan-200 mx-1 drop-shadow-[0_0_4px_rgba(34,211,238,0.15)] bg-slate-900/50 px-1 py-0.5 rounded border border-cyan-500/10"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch (err) {
                return <span key={`inline-err-${pIdx}`} className="text-red-400">${part}$</span>;
              }
            }
            return <React.Fragment key={`text-${pIdx}`}>{part}</React.Fragment>;
          })}
        </span>
      );
    });
  }, [text]);

  return <div className="math-renderer text-slate-100">{renderedContent}</div>;
};
