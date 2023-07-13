import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "@mantine/core";
import PropTypes from "prop-types";
import Integration from "../models/Integration";

const IntegrationNavLinks = ({ integrations }) => {
  const [active, setActive] = useState(-1);
  const path = useLocation().pathname;

  useEffect(() => {
    if (!path.match(/.*integrations.*/i)) {
      setActive(-1);
    }
  }, [path]);

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
