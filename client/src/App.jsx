import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { integrationService } from "./services/apiService.js";
import AppShell from "./components/AppShell.jsx";
import { Integration } from "./components/Integration.jsx";
import SettingsMenu from "./components/SettingsMenu.jsx";
import DeployGuard from "./components/DeployGuard";
import { Card, Title } from "@mantine/core";
import NetworkGraph from "./components/NetworkGraph.jsx";
import DSU from "./utils/dsu";

const fetchAndSet = async (service, setter) => {
  const data = await service.getAll();
  setter(data);
};

const App = () => {
  const [integrations, setIntegrations] = useState([]);

  const [dsu, setDsu] = useState(null);

  useEffect(() => {
    fetchAndSet(integrationService, setIntegrations);
  }, []);

  const [integrationsFilter, setIntegrationsFilter] = useState([]);
  const [filteredIntegrations, setFilteredIntegrations] = useState([]);

  useEffect(() => {
    const filterIntegrations = (names) =>
      integrationsFilter
        ? integrations.filter((integration) =>
            names?.every(
              (name) =>
                integration.consumer.name === name ||
                integration.provider.name === name
            )
          )
        : integrations;
    setFilteredIntegrations(filterIntegrations(integrationsFilter));
    setDsu(new DSU(integrations));
  }, [integrationsFilter, integrations]);

  const path = useLocation().pathname;

  return (
    <AppShell
      integrations={integrations}
      integrationsFilter={integrationsFilter}
      setIntegrationsFilter={setIntegrationsFilter}
      filteredIntegrations={filteredIntegrations}
    >
      <Routes>
        <Route
          path="/"
          element={
            <Card>
              {/* <Title order={1}>Signet Contract Broker</Title> */}
              {/* <Image
                src="/transparent-logo-horizontal-mn.svg"
                maw={1000}
                mx="auto"
                radius="md"
                fit="contain"
              /> */}
              <NetworkGraph
                integrations={filteredIntegrations}
                setIntegrationsFilter={setIntegrationsFilter}
              />
            </Card>
          }
        />
        <Route
          path="integrations/:integrationId"
          element={
            path.match(/.*integrations.*/i) && integrations.length > 0 ? (
              <Integration
                dsu={dsu}
                setIntegrationsFilter={setIntegrationsFilter}
              />
            ) : null
          }
        />
        <Route
          path="/settings/*"
          element={<SettingsMenu integrations={integrations} />}
        />
        <Route path="/deploy-guard" element={<DeployGuard />} />
        <Route
          path="*"
          element={
            <Title order={1} mt={"lg"}>
              Not Found
            </Title>
          }
        />
      </Routes>
    </AppShell>
  );
};

export default App;
