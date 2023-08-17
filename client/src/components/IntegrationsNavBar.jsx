import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MultiSelect, Navbar, Text, Flex } from "@mantine/core";

import PropTypes from "prop-types";
import Integration from "../models/Integration.js";

import IntegrationNavLinks from "./IntegrationNavLinks.jsx";
import { unique } from "../utils/helpers.js";

const IntegrationsNavBar = ({
  integrations,
  integrationsFilter,
  setIntegrationsFilter,
  filteredIntegrations,
  hidden,
}) => {
  // const navigate = useNavigate();

  const participantNames = unique(
    integrations
      .map((integration) => [
        integration.consumer.name,
        integration.provider.name,
      ])
      .flat()
  );

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      width={{ sm: 200, lg: 300 }}
      hidden={hidden}
    >
      <Flex style={{ marginBottom: "1rem" }} align={"center"}>
        <MultiSelect
          style={{ flexGrow: "1" }}
          data={participantNames.map((name) => {
            return { value: name, label: name };
          })}
          searchable
          value={integrationsFilter}
          maxSelectedValues={2}
          onChange={(value) => setIntegrationsFilter(value)}
          clearable
          placeholder="Select participants"
        />
      </Flex>

      <Text style={{ opacity: "50%" }}>Integrations</Text>

      <IntegrationNavLinks integrations={filteredIntegrations} />
    </Navbar>
  );
};

IntegrationsNavBar.propTypes = {
  integrations: PropTypes.arrayOf(PropTypes.instanceOf(Integration)).isRequired,
  filteredIntegrations: PropTypes.arrayOf(PropTypes.instanceOf(Integration))
    .isRequired,
  integrationsFilter: PropTypes.arrayOf(PropTypes.string).isRequired,
  setIntegrationsFilter: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
};

export default IntegrationsNavBar;
