import { EditorView } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import EditorCode from "#src/ui/editor/code";

/**
 * @import {Extension} from "@codemirror/state"
 */

/**
 * @type {Extension[]}
 */
const extensions = [
  markdown({
    base: markdownLanguage,
    codeLanguages: languages,
    completeHTMLTags: false,
    extensions: {
      remove: ["HTMLBlock", "HTMLTag"]
    }
  }),
  EditorView.lineWrapping
];

Object.freeze(extensions);

/**
 * @function
 * @param {Parameters<EditorCode>[0]} props
 * @returns {React.ReactNode}
 */
export default function TextEditor({ setValue, value, ...props }) {
  return <EditorCode extensions={extensions} setValue={setValue} value={value} {...props} />;
}
