const pluralize = require("pluralize");

const makeRelationNode = (relation, key) => {
  const work = relation[key];

  // Indicator of further relations from this work beyond current graph (uses
  // GraphViz's somewhat hideous syntax for HTML within a node label)
  const furtherRelationsIndicator =
    work.furtherRelationsCount > 0
      ? ` <FONT COLOR="#999999">+${work.furtherRelationsCount}</FONT>`
      : "";
  const furtherRelationsDescription = pluralize(
    "relation",
    work.furtherRelationsCount
  );

  // Drop delimiting characters from citation, to be safe
  const citation = work.citation.replace(/["<>]/g, "");

  const workNode = `"${work.id}" [
      id = "node-${work.id}",
      class = "relation-node",
      label = <${citation}${furtherRelationsIndicator}>,
      tooltip = "${work.furtherRelationsCount} further ${furtherRelationsDescription}"
    ];`;
  return workNode;
};

const makeRelationEdge = (currentWork, relation, key) => {
  // Determine which object to use when accessing IDs/citations
  let workTo, workFrom;
  if (key === "workTo") {
    workTo = relation.workTo;
    workFrom = currentWork;
  } else {
    workTo = currentWork;
    workFrom = relation.workFrom;
  }

  // Drop delimiting characters from citation, just to be safe
  const workFromCitation = workFrom.citation.replace(/["<>]/g, "");
  const workToCitation = workTo.citation.replace(/["<>]/g, "");

  const edge = `"${workFrom.id}" -> "${workTo.id}" [
    label = "${relation.type}",
    tooltip = "${workFromCitation} -> ${workToCitation}",
    labeltooltip = "${workFromCitation} -> ${workToCitation}",
    color = "${relation.color}"
  ];`;
  return edge;
};

// Compose GraphViz string representing the supplied graph object as a digraph
// to be rendered in the frontend
const makeDigraph = async graph => {
  const lines = [];

  // Set defaults for digraph, nodes, edges
  const digraphDefaults = 'tooltip = "Relata"; rankdir = "LR";';
  const nodeDefaults = `node [
    shape = "rect",
    style = "filled, rounded",
    fillcolor = "#f6f6f6",
    color = "#dddddd",
    fontname = "helvetica",
    fontsize = 10
  ];`;
  const edgeDefaults = 'edge [fontname = "helvetica", fontsize = 8];';
  lines.push(digraphDefaults, nodeDefaults, edgeDefaults);

  // Create node for the work currently in focus
  const relationsCountDescription = pluralize(
    "relation",
    graph.relationsCount,
    true
  );
  const currentWorkNode = `"${graph.id}" [
      id = "node-${graph.id}",
      class = "current-work-node",
      label = "${graph.citation}",
      tooltip = "${relationsCountDescription}",
      style = "square",
      fontname = "helvetica-bold",
      fillcolor="#ffffff",
      color="#000000",
      fontsize = 11
    ];`;
  lines.push(currentWorkNode);

  // Create nodes and edges for relations to/from the work currently in focus
  const relationsToNodes = graph.relationsTo.map(relation =>
    makeRelationNode(relation, "workFrom")
  );
  const relationsToEdges = graph.relationsTo.map(relation =>
    makeRelationEdge(graph, relation, "workFrom")
  );

  const relationsFromNodes = graph.relationsFrom.map(relation =>
    makeRelationNode(relation, "workTo")
  );
  const relationsFromEdges = graph.relationsFrom.map(relation =>
    makeRelationEdge(graph, relation, "workTo")
  );

  // Drop any duplicate nodes (works that are related both to/from this work)
  const nodes = [...new Set([...relationsToNodes, ...relationsFromNodes])];
  const edges = [...relationsFromEdges, ...relationsToEdges];

  // Add relation nodes and edges to digraph lines
  lines.push(...nodes);
  lines.push(...edges);

  // Compose digraph and return
  const digraphBody = lines.join(" ").replace(/\s+/g, " ");
  const digraph = `digraph { ${digraphBody} }`;
  return digraph;
};

module.exports = {
  makeDigraph
};
