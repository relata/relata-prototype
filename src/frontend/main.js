// Polyfills
import "core-js/stable";
import "regenerator-runtime/runtime";

import * as feathers from "@feathersjs/client";
import * as $ from "jquery";
import "bootstrap";
import * as d3 from "d3";
import "d3-graphviz";

// Require our CSS file so it gets bundled by Webpack
import "./main.css";

// Initialize Feathers client
const client = feathers();
client
  .configure(feathers.rest("http://localhost:3030").jquery($))
  .configure(feathers.authentication({ storage: window.localStorage }));

const login = async () => {
  try {
    // Try to authenticate using an existing token
    console.log("Trying to authenticate");
    const auth = await client.authenticate();
    console.log("Successful auth!");
    createAuthedUserLinks(auth.user);
  } catch (error) {
    console.log("Failed to authenticate");
    console.log(error);
    createLoginLink();
  }
};

const createLoginLink = () => {
  const loginLink = $("<a></a>")
    .attr({ href: "/oauth/github" })
    .html("Sign In via GitHub");
  $("#nav-login").html(loginLink);
};

const createAuthedUserLinks = user => {
  const accountLink = $("<a></a>")
    .attr({
      href: "#contributions-modal",
      "data-toggle": "modal"
    })
    .text("My Contributions");
  $("#nav-account").html(accountLink);

  const githubUserLink = $("<a></a>")
    .attr({
      href: "https://github.com/" + user.githubUsername,
      target: "_blank"
    })
    .text(user.githubUsername);
  const logoutLink = $("<a></a>")
    .attr({ href: "#" })
    .text("Sign Out")
    .click(async event => {
      await client.authentication.logout();
      window.open("/", "_self");
    });
  $("#nav-login")
    .empty()
    .append(["Signed in as ", githubUserLink, " (", logoutLink, ")"]);
};

// Export to browser for debugging
window.client = client;
window.login = login;

login();

// Graph UI

const makePanelHtml = relation => {
  const panelHtml = $("<div></div>").attr({
    id: "panel-" + relation.work._id,
    class: "panel panel-default result " + relation.relation_type
  });
  const panelBody = $("<div></div>").attr({ class: "panel-body" });
  const panelSpan = $("<span></span>")
    .attr({ class: "type" })
    .text(relation.relation_type);
  const panelCitation = $(relation.work.htmlCitation)
    .children()
    .first()
    .html();
  panelBody.append(panelSpan);
  panelBody.append(panelCitation);
  panelHtml.append(panelBody);
  if (relation.annotation != "undefined") {
    const annotationDiv = $("<div></div>")
      .attr({ class: "panel-footer" })
      .text(relation.annotation);
    panelHtml.append(annotationDiv);
  }
  return panelHtml;
};

const focusOnWork = async id => {
  const data = await client.service("graphs").get(id);
  // Update graph
  const graphTransition = d3
    .transition()
    .duration(360)
    .ease(d3.easeQuad);
  d3.select("#graph")
    .graphviz({ zoom: false })
    .transition(graphTransition)
    .renderDot(data.digraph, updateDOM);

  // Update current citation
  $("#current-work-citation").html(data.work.htmlCitation);

  // Map related-to works to left-hand panels
  $(".results-list").empty();
  data.relationsTo.map(relation => {
    const panelHtml = makePanelHtml(relation);
    $(".results-list").append(panelHtml);
    panelHtml.click(event => {
      focusOnWork(event.currentTarget.id.slice(6));
    });
  });

  // Automatically jump back to top of page
  $("html, body").animate({ scrollTop: 0 }, 60);
};

const updateDOM = () => {
  d3.selectAll("g.node").on("click", instance => {
    focusOnWork(instance.attributes.id.slice(5));
  });
};

// Select an arbitrary work to kick things off
focusOnWork("9XihvtxArmDbTwlK");
