import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import markdownItPluginMath from "markdown-it-math/no-default-renderer";
import Temml from "temml";
import type { Options as TemmlOptions } from "temml";

const TEMML_INLINE_OPTIONS: Readonly<TemmlOptions> = Object.freeze({
  annotate: false,
  throwOnError: true,
  strict: false,
  xml: false,
  trust: false
});

const TEMML_BLOCK_OPTIONS: Readonly<TemmlOptions> = Object.freeze({
  ...TEMML_INLINE_OPTIONS,
  displayMode: true
});

/**
 * @param code
 * @param language
 */
function highlight(code: string, language: string): string {
  language = language.toLowerCase();

  if (language && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(code, { language }).value;
    } catch {}
  }

  return markdownRenderer.utils.escapeHtml(code);
}

const markdownRenderer = new MarkdownIt({
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: false,
  highlight
}).use(markdownItPluginMath, {
  blockRenderer(src: string) {
    try {
      return Temml.renderToString(src, TEMML_BLOCK_OPTIONS);
    } catch {
      return markdownRenderer.utils.escapeHtml(src);
    }
  },
  inlineRenderer(src: string) {
    try {
      return Temml.renderToString(src, TEMML_INLINE_OPTIONS);
    } catch {
      return markdownRenderer.utils.escapeHtml(src);
    }
  }
});

markdownRenderer.disable("image");

/**
 * Remember the old renderer if overridden, or proxy to the default renderer.
 */
const renderLink: NonNullable<InstanceType<typeof MarkdownIt>["renderer"]["rules"][string]> =
  markdownRenderer.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

markdownRenderer.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx]?.attrSet("target", "_blank");
  tokens[idx]?.attrSet("rel", "noopener noreferrer");

  // Pass the token to the default renderer.
  return renderLink(tokens, idx, options, env, self);
};

export default markdownRenderer;
