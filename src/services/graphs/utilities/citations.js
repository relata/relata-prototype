const { readFileSync } = require("fs");
const path = require("path");

const Cite = require("citation-js");

// Chicago 17th ed. author-date CSL template, sourced from
// https://github.com/citation-style-language. See https://citationstyles.org
const templateName = "chicago-author-date";
const template = readFileSync(
  path.resolve(__dirname, `${templateName}.csl`),
  "utf-8"
);
Cite.CSL.register.addTemplate(templateName, template);

const trimParentheses = citation => citation.replace(/^\(|\)$/g, "");

const makeCitations = work => {
  try {
    const cite = new Cite(work.data);
    const citation = trimParentheses(
      cite.format("citation", { template: templateName })
    );
    const bibliography = cite
      .format("bibliography", { template: templateName })
      .trim();
    return { citation, bibliography };
  } catch (Error) {
    return { citation: "Error", bibliography: "Error" };
  }
};

module.exports = {
  makeCitations
};
