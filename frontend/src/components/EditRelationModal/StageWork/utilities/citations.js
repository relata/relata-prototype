import Cite from "citation-js";

import chicagoAuthorDate from "./chicagoAuthorDate";

// Chicago 17th ed. author-date CSL template, sourced from
// https://github.com/citation-style-language. See https://citationstyles.org
const templateName = "chicago-author-date";
const template = chicagoAuthorDate;
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
  } catch (error) {
    return {};
  }
};

export { makeCitations };
