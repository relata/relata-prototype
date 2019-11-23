const feathers = require("@feathersjs/client");
const $ = require("jquery");
const d3 = require("d3");
require("d3-graphviz");

const css = require("./main.css");

const client = feathers();
client
  .configure(feathers.rest("http://localhost:3030").jquery($))
  .configure(feathers.authentication({ storage: window.localStorage }));

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

const focusOnWork = id => {
  client
    .service("graphs")
    .get(id)
    .then(data => {
      currentWork = data.work;

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
    });
};

const updateDOM = () => {
  d3.selectAll("g.node").on("click", instance => {
    focusOnWork(instance.attributes.id.slice(5));
  });
};

// Select an arbitrary work to kick things off
focusOnWork("9XihvtxArmDbTwlK");
