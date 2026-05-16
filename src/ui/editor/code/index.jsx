"use client";

import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { fontCode } from "#src/lib/fonts";
import "./index.module.scss";

/**
 * @typedef {import("@uiw/react-codemirror").BasicSetupOptions} BasicSetupOptions
 * @typedef {import("@uiw/react-codemirror").ReactCodeMirrorProps} ReactCodeMirrorProps
 * @typedef {import("@uiw/react-codemirror").ViewUpdate} ViewUpdate
 */

/**
 * @typedef {Object} ButtonCustomProps
 * @property {string} value
 */

const theme = createTheme({
  theme: "dark",
  settings: {
    background: "var(--color-bg)",
    caret: "var(--color-highlight)",
    fontFamily: fontCode.style.fontFamily,
    fontSize: "0.875em",
    gutterActiveForeground: "var(--color-2)",
    gutterBackground: "var(--color-bg)",
    gutterBorder: "var(--color-highlight)",
    gutterForeground: "var(--color-4)",
    lineHighlight: "transparent",
    selection: "var(--color-input-hover)",
    selectionMatch: "var(--color-input-hover)"
  },
  styles: [
    { tag: [t.standard(t.tagName), t.tagName], color: "#7ee787" },
    { tag: [t.comment, t.bracket], color: "#8b949e" },
    { tag: [t.propertyName], color: "#d2a8ff" },
    { tag: [t.variableName, t.attributeName, t.number, t.operator], color: "#79c0ff" },
    { tag: [t.keyword, t.typeName, t.typeOperator, t.typeName], color: "#ff7b72" },
    { tag: [t.string, t.meta, t.regexp], color: "#a5d6ff" },
    { tag: [t.name, t.quote], color: "#7ee787" },
    { tag: [t.heading, t.strong], color: "#d2a8ff", fontWeight: "bold" },
    { tag: [t.emphasis], color: "#d2a8ff" /*, fontStyle: 'italic'*/ },
    { tag: [t.deleted], color: "#ffdcd7", backgroundColor: "ffeef0" },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: "#ffab70" },
    { tag: t.link, textDecoration: "underline" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.invalid, color: "#f97583" }
  ]
});

/**
 * @type {(BasicSetupOptions|boolean|undefined)}
 */
const EDITOR_BASIC_SETUP = Object.freeze({
  searchKeymap: false
});

/**
 * @param {ReactCodeMirrorProps & {
 *  value: string,
 *  setValue: React.Dispatch<React.SetStateAction<string>>
 * }} props
 */
export default function EditorCode({ setValue, value, ...props }) {
  /**
   * @function setValueOnChange
   * @param {string} newValue
   * @param {ViewUpdate} viewUpdate
   */
  function setValueOnChange(newValue, viewUpdate) {
    if (viewUpdate.docChanged) {
      setValue(newValue);
    }
  }

  return (
    <CodeMirror
      {...props}
      basicSetup={EDITOR_BASIC_SETUP}
      editable={true}
      onChange={setValueOnChange}
      readOnly={false}
      theme={theme}
      value={value}
    />
  );
}
