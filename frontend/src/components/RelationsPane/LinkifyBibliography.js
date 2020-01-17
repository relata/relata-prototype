import React from "react";
import Linkify from "react-linkify";

// Workaround to enable Linkify to target _new within React-Bootstrap
// components
const componentDecorator = (href, text, key) => (
  <a href={href} key={key} rel="noopener noreferrer" target="_blank">
    {text}
  </a>
);

const LinkifyBibliography = props => {
  return (
    <Linkify componentDecorator={componentDecorator}>{props.children}</Linkify>
  );
};

export default LinkifyBibliography;
