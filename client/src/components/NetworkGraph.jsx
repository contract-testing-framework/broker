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
          color: randomColor(100, 60, 1, participant.id),
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
      randomSeed: 1,
      hierarchical: {
        enabled: false,
        levelSeparation: 150,
        nodeSpacing: 200,
        treeSpacing: 200,
        blockShifting: true,
        edgeMinimization: true,
        parentCentralization: true,
        direction: "UD",
        sortMethod: "hubsize",
        shakeTowards: "leaves",
      },
    },
    physics: {
      enabled: true,
      barnesHut: {
        avoidOverlap: 1,
        centralGravity: 0.2,
        damping: 1,
        springLength: 180,
      },
    },
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
    },
  };

  const events = {
    doubleClick: ({ edges: edgeIds, nodes: nodeIds }) => {
      if (
        edgeIds.length === 1 &&
        (nodeIds.length === 2 || nodeIds.length === 0)
      ) {
        navigate(`/integrations/${edgeIds[0]}`);
      } else if (nodeIds.length === 1) {
        setIntegrationsFilter([
          nodes.find((node) => node.id == nodeIds[0]).label,
        ]);
      } else if (nodeIds.length === 0 && edgeIds.length === 0) {
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
