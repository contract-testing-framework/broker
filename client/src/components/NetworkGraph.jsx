// NetworkGraph.jsx

import Graph from "react-graph-vis";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Integration from "../models/Integration.js";
import { randomColorHSL as randomColor, uniqueBy } from "../utils/helpers.js";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const NetworkGraph = ({ integrations, setIntegrationsFilter }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const participants = uniqueBy(
      integrations.reduce((participants, integration) => {
        return [...participants, integration.consumer, integration.provider];
      }, []),
      "name"
    );

    setNodes(
      participants.map((participant) => {
        return {
          id: participant.id,
          label: participant.name,
          color: randomColor(100, 60, 1),
        };
      })
    );

    setEdges(
      integrations.map((integration) => {
        return {
          to: integration.consumer.id,
          from: integration.provider.id,
          id: integration.id,
          title: integration.name,
        };
      })
    );
  }, [integrations]);

  const options = {
    layout: {
      improvedLayout: true,
      // clusterThreshold: 200,
      randomSeed: 1,
      hierarchical: {
        enabled: false,
        levelSeparation: 150,
        nodeSpacing: 200,
        treeSpacing: 200,
        blockShifting: true,
        edgeMinimization: true,
        parentCentralization: true,
        direction: "UD", // UD, DU, LR, RL
        sortMethod: "hubsize", // hubsize, directed
        shakeTowards: "leaves", // roots, leaves
      },
    },
    physics: {
      // enabled: false,
      enabled: true,
      barnesHut: {
        avoidOverlap: 1,
        centralGravity: 0.2,
        damping: 1,
        springLength: 180,
      },
      // repulsion: {
      //   centralGravity: 0.2,
      //   springLength: 200,
      //   springConstant: 0.05,
      //   nodeDistance: 500,
      //   damping: 0.09,
      // },
      // hierarchicalRepulsion: {
      //   centralGravity: 0.0,
      //   springLength: 100,
      //   springConstant: 0.01,
      //   nodeDistance: 120,
      //   damping: 0.09,
      //   avoidOverlap: 0.1,
      // },
    },
    // configure: {
    //   enabled: true,
    //   filter: true,
    //   showButton: true,
    //   // container: configContainer,
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
      color: "rgb(86, 86, 86)",
      width: 5,
      hoverWidth: 5,
      smooth: true,
      arrows: {
        to: {
          scaleFactor: 1.2,
        },
      },
      endPointOffset: {
        to: -5.3,
      },
      arrowStrikethrough: true,
      // shadow: true,
    },
  };

  const events = {
    // select: ({ nodes, edges }) => {
    //   console.log("Selected nodes:");
    //   console.log(nodes);
    //   console.log("Selected edges:");
    //   console.log(edges);
    // },
    // doubleClick: ({ items, edges, canvas }) => {
    doubleClick: ({ edges, nodes }) => {
      // console.log(event);
      // console.table({
      //   nodes: event.nodes,
      //   edges: event.edges,
      //   items: event.items,
      // });
      console.log(`nodes.length = ${nodes.length}`);
      console.log(`edges.length = ${edges.length}`);
      if (edges.length === 1 && (nodes.length === 2 || nodes.length === 0)) {
        console.log(`I should navigate to /integrations/${edges[0]}`);
        navigate(`/integrations/${edges[0]}`);
      } else if (nodes.length === 1) {
        // console.log(`nodes[0] = ${nodes[0]}`);
        setIntegrationsFilter(edges.find((edge) => edge.id == nodes[0]));
      } else if (nodes.length === 0 && edges.length === 0) {
        setIntegrationsFilter([]);
      }
    },
  };

  return integrations.length ? (
    <>
      <Graph
        graph={{ nodes, edges }}
        options={options}
        events={events}
        style={{ height: "800px" }}
        key={uuidv4()}
      />
    </>
  ) : null;
};

NetworkGraph.propTypes = {
  integrations: PropTypes.arrayOf(PropTypes.instanceOf(Integration)).isRequired,
  setIntegrationsFilter: PropTypes.func.isRequired,
};

export default NetworkGraph;
