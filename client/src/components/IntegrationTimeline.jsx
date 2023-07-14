import { Card, Timeline, Text, Code } from "@mantine/core";
import {
  IconGitCommit,
  IconCertificate2,
  IconClipboardList,
  IconArrowBigUp,
} from "@tabler/icons-react";
import ReactTimeAgo from "react-time-ago";
import Spec from "../models/Spec.js";
import Contract from "../models/Contract.js";
import ParticipantVersion from "../models/ParticipantVersion.js";
import PropTypes from "prop-types";
import Integration from "../models/Integration";
import { uniqueByHash, uniqueById } from "../utils/helpers.js";

const colors = {
  consumer: {
    version: "red",
    contract: "orange",
    deployment: "yellow",
  },
  provider: {
    version: "green",
    spec: "blue",
    deployment: "violet",
  },
};

const icons = {
  consumer: {
    version: <IconGitCommit size={24} />,
    contract: <IconClipboardList size={24} />,
    deployment: <IconArrowBigUp size={24} />,
  },
  provider: {
    version: <IconGitCommit size={24} />,
    spec: <IconCertificate2 size={24} />,
    deployment: <IconArrowBigUp size={24} />,
  },
};

const setupProps = (item, integration) => {
  switch (item.constructor) {
    case Spec: {
      return {
        createdAt: item.createdAt,
        docType: "Provider Spec",
        participantName: integration.provider.name,
        message: `${integration.provider.name} added new provider spec version ${item.spec.info.version}`,
        color: colors.provider.spec,
        icon: icons.provider.spec,
        title: `${integration.provider.name} Spec ${item.spec.info.version}`,
      };
    }

    case Contract: {
      return {
        createdAt: item.createdAt,
        docType: "Consumer Contract",
        participantName: integration.consumer.name,
        message: `${integration.consumer.name} added a new consumer contract`,
        color: colors.consumer.contract,
        icon: icons.consumer.contract,
        title: `${integration.consumer.name} Contract ${item.hash.slice(0, 6)}`,
      };
    }

    case ParticipantVersion: {
      const props = {};

      props.createdAt = item.createdAt;
      if (item.participantType == "consumer") {
        props.docType = "Consumer Version";
        props.participantName = integration.consumer.name;
        props.color = colors.consumer.version;
        props.icon = icons.consumer.version;
      } else {
        props.docType = "Provider Version";
        props.participantName = integration.provider.name;
        props.color = colors.provider.version;
        props.icon = icons.provider.version;
      }
      props.title = `${props.participantName} version ${item.version}`;
      props.message = (
        <>
          New {props.docType.toLowerCase()} version
          <Code>{item.version}</Code>
        </>
      );
      props.lineVariant = "dashed";
      return props;
    }

    default: {
      const props = {};

      props.createdAt = item.createdAt;

      props.docType = "Deployment";

      if (item.participantType === "consumer") {
        props.participantName = integration.consumer.name;
        props.icon = icons.consumer.deployment;
      } else {
        props.participantName = integration.provider.name;
        props.icon = icons.provider.deployment;
      }
      props.environmentName = item.environment.environmentName;
      props.color = colors[item.participantType].deployment;
      props.title = `${props.participantName} Deployment`;
      props.message = (
        <>
          {`${props.participantName} deployed version ${item.participantVersion.version} to`}
          <Code>{item.environment.environmentName}</Code>
        </>
      );
      return props;
    }
  }
};

const IntegrationTimeline = ({ integration }) => {
  const { comparisons } = integration;

  const consumerContracts = uniqueByHash(
    comparisons.map((comparison) => {
      return comparison.consumerContract;
    })
  );

  const providerSpecs = uniqueByHash(
    comparisons.map((comparison) => {
      return comparison.providerSpec;
    })
  );

  const consumerVersions = uniqueById(
    consumerContracts.map((contract) => contract.consumerVersions).flat()
  );
  consumerVersions.forEach((version) => {
    version.participantType = "consumer";
  });

  const providerVersions = uniqueById(
    providerSpecs.map((spec) => spec.providerVersions).flat()
  );

  providerVersions.forEach((version) => {
    version.participantType = "provider";
  });

  const participantVersions = [...consumerVersions, ...providerVersions];

  const deployments = participantVersions
    .map((version) => {
      return version.deployments.map((deployment) => {
        return {
          ...deployment,
          participantVersion: version,
          participantType: version.participantType,
          createdAt: new Date(deployment.createdAt),
        };
      });
    })
    .flat();

  let timeLineItems = [
    ...participantVersions,
    ...providerSpecs,
    ...consumerContracts,
    ...deployments,
  ]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((item) => setupProps(item, integration));

  return (
    <Card mt={"lg"}>
      <Timeline
        active={100}
        bulletSize={24}
        lineWidth={3}
        ml={"5rem"}
        mt={"3rem"}
      >
        {timeLineItems.map((item, index) => (
          <Timeline.Item
            bullet={item.icon}
            title={item.title}
            key={index}
            bulletSize={36}
            color={item.color}
            lineVariant={item.lineVariant || "solid"}
          >
            <Text color="dimmed" size="sm">
              {item.message}
            </Text>
            <Text size="xs" mt={4}>
              <ReactTimeAgo date={item.createdAt} />
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};

IntegrationTimeline.propTypes = {
  integration: PropTypes.instanceOf(Integration).isRequired,
};

export default IntegrationTimeline;
