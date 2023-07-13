import { Anchor, Card, Timeline, Text } from "@mantine/core";
import {
  // IconGitBranch,
  // IconGitPullRequest,
  IconGitCommit,
  // IconMessageDots,
  IconCertificate2,
  IconClipboardList,
} from "@tabler/icons-react";
// import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import Spec from "../models/Spec.js";
import Contract from "../models/Contract.js";
import ParticipantVersion from "../models/ParticipantVersion.js";
import PropTypes from "prop-types";
import Integration from "../models/Integration";
import { uniqueByHash, uniqueById } from "../utils/helpers.js";

const IntegrationTimeline = ({ integration }) => {
  // console.log("integration:");
  // console.log(integration);

  const { comparisons } = integration;

  // let participantVersions = uniqueById(
  //   comparisons.reduce((acc, comp) => {
  //     return acc.concat([
  //       ...comp.consumerContract.consumerVersions,
  //       ...comp.providerSpec.providerVersions,
  //     ]);
  //   }, [])
  // );

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

  // console.log("consumerVersions:");
  // console.log(consumerVersions);
  // console.log("providerVersions:");
  // console.log(providerVersions);

  // console.log("consumerContracts:");
  // console.log(consumerContracts);

  // console.log("providerSpecs:");
  // console.log(providerSpecs);

  let timeLineItems = [
    ...consumerVersions,
    ...providerVersions,
    ...providerSpecs,
    ...consumerContracts,
  ]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((item) => {
      const props = {};

      if (item instanceof Spec) {
        props.docType = "Provider Spec";
        props.participantName = integration.provider.name;
        props.message = `${props.participantName} added a new provider spec: ${item.spec.info.version}`;
        props.color = "blue";
        props.icon = <IconCertificate2 size={24} />;
        props.title = `${props.participantName} Spec ${item.spec.info.version}`;
      } else if (item instanceof Contract) {
        props.docType = "Consumer Contract";
        props.participantName = integration.consumer.name;
        props.message = `${props.participantName} added a new consumer contract`;
        props.color = "orange";
        props.icon = <IconClipboardList size={24} />;
        props.title = `${props.participantName} Contract ${item.hash.slice(
          0,
          6
        )}`;
      } else if (item instanceof ParticipantVersion) {
        if (item.participantType == "consumer") {
          props.docType = "Consumer Version";
          props.participantName = integration.consumer.name;
          props.color = "green";
          props.title = `${integration.consumer.name} app version ${item.version}`;
        } else {
          props.docType = "Provider Version";
          props.participantName = integration.provider.name;
          props.color = "red";
        }
        props.title = `${props.participantName} app version ${item.version}`;
        props.message = `${props.participantName} added a new ${props.docType}: ${item.version}`;
        props.icon = <IconGitCommit size={24} />;
        props.lineVariant = "dashed";
      }

      return (
        <Timeline.Item
          bullet={props.icon}
          title={props.title}
          key={`${item.participantName}-${item.createdAt}`}
          bulletSize={36}
          color={props.color}
          lineVariant={props.lineVariant || "solid"}
        >
          <Anchor color="dimmed" size="sm">
            {props.message}
          </Anchor>
          <Text size="xs" mt={4}>
            <ReactTimeAgo date={item.createdAt} />
          </Text>
        </Timeline.Item>
      );
    });

  return (
    <Card mt={"lg"}>
      <Timeline
        active={100}
        bulletSize={24}
        lineWidth={3}
        ml={"5rem"}
        mt={"3rem"}
      >
        {timeLineItems}
      </Timeline>
      {/* <Timeline active={1} bulletSize={24} lineWidth={2}>
        <Timeline.Item bullet={<IconGitBranch size={12} />} title="New branch">
          <Text color="dimmed" size="sm">
            You&apos;ve created new branch{" "}
            <Text variant="link" component="span" inherit>
              fix-notifications
            </Text>{" "}
            from master
          </Text>
          <Text size="xs" mt={4}>
            2 hours ago
          </Text>
        </Timeline.Item>

        <Timeline.Item bullet={<IconGitCommit size={12} />} title="Commits">
          <Text color="dimmed" size="sm">
            You&apos;ve pushed 23 commits to
            <Text variant="link" component="span" inherit>
              fix-notifications branch
            </Text>
          </Text>
          <Text size="xs" mt={4}>
            52 minutes ago
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Pull request"
          bullet={<IconGitPullRequest size={12} />}
          lineVariant="dashed"
        >
          <Text color="dimmed" size="sm">
            You&apos;ve submitted a pull request
            <Text variant="link" component="span" inherit>
              Fix incorrect notification message (#187)
            </Text>
          </Text>
          <Text size="xs" mt={4}>
            34 minutes ago
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Code review"
          bullet={<IconMessageDots size={12} />}
        >
          <Text color="dimmed" size="sm">
            <Text variant="link" component="span" inherit>
              Robert Gluesticker
            </Text>{" "}
            left a code review on your pull request
          </Text>
          <Text size="xs" mt={4}>
            12 minutes ago
          </Text>
        </Timeline.Item>
      </Timeline> */}
    </Card>
  );
};

IntegrationTimeline.propTypes = {
  integration: PropTypes.instanceOf(Integration).isRequired,
};

export default IntegrationTimeline;
