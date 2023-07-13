import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "@mantine/core";
import PropTypes from "prop-types";
import Integration from "../models/Integration";

const IntegrationNavLinks = ({ integrations }) => {
  const path = useLocation().pathname;

  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!path.match(/.*integrations.*/i)) {
      setActive(-1);
    } else {
      const integrationIdMatch = path.match(/\/integrations\/(\d+)/);
      if (integrationIdMatch) {
        setActive(
          integrations.findIndex(
            (integration) => integration.id === Number(integrationIdMatch[1])
          )
        );
      }
    }
  }, [path, integrations]);

  return integrations.map((integration, index) => {
    const nameString = `${integration.consumer.name} ⇄ ${integration.provider.name}`;

    return (
      <NavLink
        to={`/integrations/${integration.id}`}
        label={nameString}
        key={nameString}
        active={index === active}
        onClick={() => setActive(index)}
        component={Link}
      />
    );
  });
};

IntegrationNavLinks.propTypes = {
  integrations: PropTypes.arrayOf(PropTypes.instanceOf(Integration)),
};

export default IntegrationNavLinks;
