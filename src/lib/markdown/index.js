import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import * as utils from "markdown-it/lib/common/utils.mjs";
import markdownItPluginMath from "markdown-it-math/no-default-renderer";
import Temml from "temml";

/**
 * @import {Options as TemmlOptions} from "temml"
 */

/**
 * @type {Readonly<TemmlOptions>}
 */
const TEMML_INLINE_OPTIONS = Object.freeze({
  annotate: false,
  throwOnError: true,
  strict: false,
  xml: false,
  trust: false
});

/**
 * @type {Readonly<TemmlOptions>}
 */
const TEMML_BLOCK_OPTIONS = Object.freeze({
  ...TEMML_INLINE_OPTIONS,
  displayMode: true
});

const markdownRenderer = MarkdownIt({
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: false,
  highlight(code, language) {
    language = language.toLowerCase();

    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value;
      } catch {}
    }

    return utils.escapeHtml(code);
  }
}).use(markdownItPluginMath, {
  blockRenderer(src) {
    try {
      return Temml.renderToString(src, TEMML_BLOCK_OPTIONS);
    } catch {
      return utils.escapeHtml(src);
    }
  },
  inlineRenderer(src) {
    try {
      return Temml.renderToString(src, TEMML_INLINE_OPTIONS);
    } catch {
      return utils.escapeHtml(src);
    }
  }
});

markdownRenderer.disable("image");

// Remember the old renderer if overridden, or proxy to the default renderer.
const renderLink =
  markdownRenderer.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

/**
 * @type {renderLink}
 */
markdownRenderer.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx]?.attrSet("target", "_blank");
  tokens[idx]?.attrSet("rel", "noopener noreferrer");

  // Pass the token to the default renderer.
  return renderLink(tokens, idx, options, env, self);
};

export default markdownRenderer;
