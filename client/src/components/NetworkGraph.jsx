// NetworkGraph.jsx

import Graph from "react-graph-vis";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Integration from "../models/Integration.js";
import { randomColor, uniqueBy } from "../utils/helpers.js";
// import SigmaGraph from "./SigmaGraph.jsx";
import { v4 as uuidv4 } from "uuid";

const options = {
  layout: {
    improvedLayout: true,
    // clusterThreshold: 200,

    hierarchical: {
      enabled: false,
      levelSeparation: 150,
      nodeSpacing: 100,
      treeSpacing: 200,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: "UD", // UD, DU, LR, RL
      sortMethod: "hubsize", // hubsize, directed
      shakeTowards: "leaves", // roots, leaves
    },
  },
  // configure: {
  // enabled: true,
  // filter: "nodes,edges",
  // showButton: true,
  // },
  autoResize: true,
  nodes: {
    margin: 10,
    shape: "box",
    size: 30,
    font: {
      size: 20,
      color: "white",
      face: "Nunito",
    },
    borderWidth: 2,
    shadow: true,
  },
  edges: {
    color: "#000000",
  },
};

const events = {
  select: ({ nodes, edges }) => {
    console.log("Selected nodes:");
    console.log(nodes);
    console.log("Selected edges:");
    console.log(edges);
  },
  // doubleClick: ({ pointer: { canvas } }) => {
  // createNode(canvas.x, canvas.y);
  // },
};

const NetworkGraph = ({ integrations }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  // const [state, setState] = useState({
  //   graph: {
  //     nodes: [],
  //     edges: [],
  //   },
  // });

  useEffect(() => {
    const participants = uniqueBy(
      integrations.reduce((participants, integration) => {
        return [...participants, integration.consumer, integration.provider];
      }, []),
      "name"
    );

    // console.log("participants:");
    // console.log(participants);

    setNodes(
      participants.map((participant) => {
        return {
          id: participant.id,
          label: participant.name,
          color: randomColor(),
          // color: "red",
        };
      })
    );

    setEdges(
      integrations.map((integration) => {
        return {
          from: integration.consumer.id,
          to: integration.provider.id,
        };
      })
    );
  }, [integrations]);

  // const { graph, events } = state;
  return integrations.length ? (
    <Graph
      graph={{ nodes, edges }}
      options={options}
      events={events}
      style={{ height: "640px" }}
      key={uuidv4()}
    />
  ) : null;
};

NetworkGraph.propTypes = {
  integrations: PropTypes.arrayOf(PropTypes.instanceOf(Integration)).isRequired,
};

export default NetworkGraph;
