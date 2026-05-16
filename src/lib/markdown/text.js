import MarkdownIt from "markdown-it";
import markdownItPluginPlainText from "markdown-it-plain-text";

const markdownTextRenderer = MarkdownIt({
  html: false,
  xhtmlOut: false,
  breaks: false,
  typographer: false
}).use(markdownItPluginPlainText);

export default markdownTextRenderer;
