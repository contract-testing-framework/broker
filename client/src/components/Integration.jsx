import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { integrationService } from "../services/apiService.js";
import { Tabs, Title, Text } from "@mantine/core";
import IntegrationOverviewTab from "./IntegrationOverviewTab.jsx";
import Matrix from "./Matrix.jsx";
import Contracts from "./Contracts.jsx";
import IntegrationTimeline from "./IntegrationTimeline.jsx";

const Integration = () => {
  const { integrationId } = useParams();
  const [integration, setIntegration] = useState(null);
  const [activeTab, setActiveTab] = useState("timeline");
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    const fetchAndSet = async () => {
      const data = await integrationService.getById(integrationId);
      setIntegration(data);
    };
    fetchAndSet();
  }, [integrationId]);

  const handleViewContracts = (comparison) => {
    setActiveTab("contracts");
    setComparison(comparison);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return integration ? (
    <>
      <Title order={1} mt={"md"} mb={"md"}>
        <Text display={"inline"} variant="gradient">
          {integration.consumer.name} ⇄ {integration.provider.name}{" "}
        </Text>
      </Title>

      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
          <Tabs.Tab value="comparisons">Comparisons</Tabs.Tab>
          <Tabs.Tab value="matrix">Matrix</Tabs.Tab>
          {/* <Tabs.Tab value="webhooks">Webhooks</Tabs.Tab> */}
          <Tabs.Tab
            value="contracts"
            style={activeTab === "contracts" ? {} : { display: "none" }}
          >
            Contracts
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="timeline">
          <IntegrationTimeline
            integration={integration}
            onViewContracts={handleViewContracts}
          />
        </Tabs.Panel>

        <Tabs.Panel value="comparisons">
          <Title order={2} mt={"md"} mb={"md"}>
            Comparisons
          </Title>
          <IntegrationOverviewTab
            comparisons={integration.comparisons}
            onViewContracts={handleViewContracts}
          />
        </Tabs.Panel>

        <Tabs.Panel value="matrix">
          <Matrix comparisons={integration.comparisons} />
        </Tabs.Panel>

        {/* <Tabs.Panel value="webhooks">
          <Title order={2} mt={"md"} mb={"md"}>Webhooks</Title>
        </Tabs.Panel> */}
        {activeTab === "contracts" ? (
          <Tabs.Panel value="contracts">
            {comparison ? <Contracts comparison={comparison} /> : null}
          </Tabs.Panel>
        ) : null}
      </Tabs>
    </>
  ) : null;
};

export { Integration };
