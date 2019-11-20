const feathers = require("@feathersjs/client");
const $ = require("jquery");
const d3 = require("d3");
require("d3-graphviz");

const css = require("./main.css");

const client = feathers();
client
  .configure(feathers.rest("http://localhost:3030").jquery($))
  .configure(feathers.authentication({ storage: window.localStorage }));

const graph = d3.select("#graph");
let currentWork;

const makePanelHtml = relation => {
  let annotationDiv;
  if (relation.annotation) {
    annotationDiv = `<div class='panel-footer'>${relation.annotation}</div>`;
  } else {
    annotationDiv = "";
  }
  // prettier-ignore
  let panelHtml = $(
    '<div id="panel-' + relation.work._id + '" class="panel panel-default result ' + relation.relation_type + '">' +
        '<div class="panel-body">' +
            '<span class="type">' + relation.relation_type + '</span>' +
            $(relation.work.htmlCitation).children().first().html() +
        '</div>' +
        annotationDiv +
      '</div>'
  );
  return panelHtml;
};

const focusOnWork = id => {
  client
    .service("graphs")
    .get(id)
    .then(data => {
      currentWork = data.work;

      // Update graph
      graph
        .graphviz({ zoom: false })
        .transition()
        .renderDot(data.digraph, updateDOM);

      // Update current citation
      $("#current-work-citation").html(currentWork.htmlCitation);

      // Map related-to works to left-hand panels
      $(".results-list").empty();
      data.relationsTo.map(relation => {
        let panelHtml = makePanelHtml(relation);

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
