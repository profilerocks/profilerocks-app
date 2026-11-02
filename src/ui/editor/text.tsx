import { EditorView } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import EditorCode from "#src/ui/editor/code";
import type { Extension } from "@codemirror/state";

const extensions: Extension[] = [
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

export default function TextEditor({ setValue, value, ...props }: Parameters<typeof EditorCode>[0]): React.ReactNode {
  return <EditorCode extensions={extensions} setValue={setValue} value={value} {...props} />;
}
