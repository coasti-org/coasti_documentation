import PropTypes from "prop-types";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useMDXComponents } from "@mdx-js/react";
import clsx from "clsx";
import styles from "./styles.module.css";

// headingPrefixMap is built inside the component (via useMDXComponents) and
// passed here so both copy and animation recover the "# " prefix that MDX strips.
function getCopyText(children, headingPrefixMap) {
  let text = "";
  if (Array.isArray(children)) {
    children.forEach((child, index) => {
      text += getCopyText(child, headingPrefixMap);
      if (index < children.length - 1) {
        text += "\n";
      }
    });
  } else if (typeof children === "string") {
    text += children;
  } else if (typeof children === "object" && children !== null) {
    const prefix = headingPrefixMap?.get(children.type) ?? "";
    if (children.props?.children) {
      text += prefix + getCopyText(children.props.children, headingPrefixMap);
    }
  }
  return text;
}

// Accepts fenced code blocks inside MDX:
// <Terminal>```terminal ... ```</Terminal>
// MDX turns that into <pre><code>...</code></pre>; extract the raw code string.
function getFencedCodeText(children) {
  const preNode = Array.isArray(children) ? children[0] : children;
  if (!preNode || typeof preNode !== "object") return null;
  if (preNode.type !== "pre") return null;

  const codeNode = preNode.props?.children;
  if (!codeNode || typeof codeNode !== "object") return null;
  if (codeNode.type !== "code") return null;

  const codeChildren = codeNode.props?.children;
  if (typeof codeChildren === "string") return codeChildren;
  if (Array.isArray(codeChildren)) {
    return codeChildren
      .map((part) => (typeof part === "string" ? part : ""))
      .join("");
  }
  return null;
}

const PROMPT_MARKER = "[prompt]";

function parsePromptLine(line) {
  if (!line.startsWith(PROMPT_MARKER)) {
    return { line, forceCommandAnimation: false };
  }

  const stripped = line
    .slice(PROMPT_MARKER.length)
    .replace(/^\s?/, "");

  return { line: stripped, forceCommandAnimation: true };
}

// Auto-scales speed based on line count so long terminals don't drag on.
// Explicit props always take priority over these defaults.
function autoSpeed(lineCount) {
  if (lineCount <= 5) return { speed: 40, delay: 400 };
  if (lineCount <= 10) return { speed: 25, delay: 200 };
  if (lineCount <= 20) return { speed: 20, delay: 150 };
  return { speed: 12, delay: 100 };
}

const CopyIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
    />
  </svg>
);

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
    />
  </svg>
);

export default function Terminal({
  children,
  title,
  wrap = true,
  typewriter = false,
  typewriterSpeed,
  typewriterLineDelay,
  copyOnlyPrompts = false,
}) {
  const displayTitle = title || "";
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Docusaurus registers h1–h6 as anonymous arrow functions in the MDX components
  // map, so children.type is a function reference, not the string "h1". Build a
  // Map keyed by those exact references so getCopyText can recover the "# " prefix.
  const mdxComponents = useMDXComponents();
  const headingPrefixMap = useMemo(() => {
    const map = new Map();
    ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag, i) => {
      const prefix = "#".repeat(i + 1) + " ";
      if (mdxComponents[tag]) map.set(mdxComponents[tag], prefix);
      map.set(tag, prefix); // fallback for native HTML headings
    });
    return map;
  }, [mdxComponents]);

  const { terminalText, commandLineFlags } = useMemo(() => {
    const fencedCodeText = getFencedCodeText(children);
    const sourceText =
      fencedCodeText !== null ? fencedCodeText : getCopyText(children, headingPrefixMap);

    const parsedLines = sourceText.split("\n").map((rawLine) => {
      const { line, forceCommandAnimation } = parsePromptLine(rawLine);
      return {
        line,
        isCommand: forceCommandAnimation || /^\s*[$#]/.test(line),
      };
    });

    return {
      terminalText: parsedLines.map((entry) => entry.line).join("\n"),
      commandLineFlags: parsedLines.map((entry) => entry.isCommand),
    };
  }, [children, headingPrefixMap]);

  // Extract lines once from children text content
  const animLines = useMemo(
    () => (typewriter ? terminalText.split("\n") : []),
    [typewriter, terminalText],
  );

  const animCommandFlags = useMemo(
    () => (typewriter ? commandLineFlags : []),
    [typewriter, commandLineFlags],
  );

  const copyText = useMemo(() => {
    if (!copyOnlyPrompts) {
      return terminalText;
    }

    const lines = terminalText.split("\n");
    return lines
      .filter((line, idx) => (commandLineFlags[idx] ?? false) && line.trim() !== "")
      .join("\n");
  }, [terminalText, commandLineFlags, copyOnlyPrompts]);

  // Effective speed: explicit prop wins; otherwise auto-scale to line count
  const { speed: effectiveSpeed, delay: effectiveDelay } = useMemo(() => {
    const auto = autoSpeed(animLines.length);
    return {
      speed: typewriterSpeed ?? auto.speed,
      delay: typewriterLineDelay ?? auto.delay,
    };
  }, [animLines.length, typewriterSpeed, typewriterLineDelay]);

  // Start animation only when the terminal scrolls into view
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (!typewriter) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // Fallback for environments without IntersectionObserver (SSR, old browsers)
      setHasBeenVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [typewriter]);

  const [revealedLines, setRevealedLines] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [animDone, setAnimDone] = useState(false);

  // Animation tick — only runs once the component is visible
  useEffect(() => {
    if (!typewriter || !hasBeenVisible || animDone) return;

    if (lineIdx >= animLines.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- terminal step of a setTimeout-driven typewriter animation, not derivable at render time
      setAnimDone(true);
      return;
    }

    const line = animLines[lineIdx];
    const isCommand = animCommandFlags[lineIdx] ?? false;

    if (isCommand && charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), effectiveSpeed);
      return () => clearTimeout(t);
    }

    // Line complete — pause then advance
    const pause = line.trim() === "" ? 80 : effectiveDelay;
    const t = setTimeout(() => {
      setRevealedLines((prev) => [...prev, line]);
      setLineIdx((l) => l + 1);
      setCharIdx(0);
    }, pause);
    return () => clearTimeout(t);
  }, [
    typewriter,
    hasBeenVisible,
    animDone,
    lineIdx,
    charIdx,
    animLines,
    animCommandFlags,
    effectiveSpeed,
    effectiveDelay,
  ]);

  const skipAnimation = useCallback(() => {
    if (!typewriter || animDone) return;
    setRevealedLines(animLines);
    setLineIdx(animLines.length);
    setAnimDone(true);
  }, [typewriter, animDone, animLines]);

  const handleCopy = useCallback(async () => {
    const textToCopy = copyText;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [copyText]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const animDisplay = useMemo(() => {
    if (!typewriter || animDone) return null;
    const partial = animLines[lineIdx]?.slice(0, charIdx) ?? "";
    return [...revealedLines, partial].join("\n");
  }, [typewriter, animDone, revealedLines, lineIdx, charIdx, animLines]);

  const isAnimating = typewriter && !animDone;

  return (
    <div
      ref={containerRef}
      className={styles.terminal}
      onClick={skipAnimation}
      style={isAnimating ? { cursor: "pointer" } : undefined}
      title={isAnimating ? "Click to skip animation" : undefined}
    >
      <div className={styles.terminal_header}>
          <div className={styles.terminal_controls}>
            <span className={clsx(styles.dot, styles.red)} />
            <span className={clsx(styles.dot, styles.yellow)} />
            <span className={clsx(styles.dot, styles.green)} />
          </div>
          <div className={styles.terminal_content}>
            <span className={styles.terminal_title}>{displayTitle}</span>
          </div>

        <div className={styles.terminal_header_actions}>
          <button
            type="button"
            aria-label="Copy code to clipboard"
            className={clsx(
              "clean-btn",
              "button--sm",
              "button--secondary",
              styles.copyButton,
              { [styles.copied]: copied },
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {copied ? (
              <CheckIcon className={styles.copyButtonSvg} />
            ) : (
              <CopyIcon className={styles.copyButtonSvg} />
            )}
          </button>
        </div>
      </div>

      <pre
        className={clsx(styles.terminal_body, {
          [styles.no_wrap]: !wrap,
        })}
      >
        {isAnimating ? (
          <>
            {/*
             * Ghost: renders the real children invisibly so the <pre> immediately
             * occupies its final height. Prevents page reflow on every typed line.
             */}
            <span className={styles.terminal_ghost} aria-hidden="true">
              {terminalText}
            </span>
            {/* Animated text overlaid on the ghost */}
            <span className={styles.terminal_overlay}>
              {animDisplay}
              <span className={styles.cursor} aria-hidden="true">
                ▋
              </span>
            </span>
          </>
        ) : (
          terminalText
        )}
      </pre>
    </div>
  );
}

Terminal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  wrap: PropTypes.bool,
  /** Enables typewriter animation. Command lines ($/#) typed char-by-char; output lines appear whole. Click to skip. */
  typewriter: PropTypes.bool,
  /** ms per character on command lines. Omit to auto-scale based on line count. */
  typewriterSpeed: PropTypes.number,
  /** ms before each output line appears. Omit to auto-scale based on line count. */
  typewriterLineDelay: PropTypes.number,
  /** If true, copy button copies only command/prompt lines ($/#/[prompt]). */
  copyOnlyPrompts: PropTypes.bool,
};
