import Comparison from "../models/Comparison.js";
import PropTypes from "prop-types";
import {
  ThemeIcon,
  Card,
  Accordion,
  Stack,
  Text,
  Group,
  Title,
} from "@mantine/core";
import { CircleCheck, CircleX, AlertCircle } from "tabler-icons-react";
import { Prism } from "@mantine/prism";

const Interactions = ({ comparison }) => {
  const { result, consumerContract } = comparison;
  const interactions = consumerContract.contract.interactions.map(
    ({ description, request, response, providerStates }) => ({
      description:
        description +
        (providerStates
          ? providerStates[0]?.name
            ? " given " + providerStates[0].name
            : ""
          : ""),
      request,
      response,
      tests: [],
    })
  );

  const getType = (tests) => {
    if (tests.length === 0) return "success";
    if (tests[0].type === "error") return "error";
    return "warning";
  };

  const typeColor = {
    error: "red",
    warning: "orange",
    success: "green",
  };

  const typeIcon = {
    error: <CircleX size="1rem" />,
    warning: <AlertCircle size="1rem" />,
    success: <CircleCheck size="1rem" />,
  };

  for (const test of [...result.errors, ...result.warnings]) {
    const interactionIdx = test.mockDetails.location.match(
      /interactions\[(\d+)\]/
    )[1];
    interactions[interactionIdx].tests.push(test);
  }

  return (
    <>
      <Title order={3} mb={"1rem"} style={{ textAlign: "left" }}>
        Interactions
      </Title>
      <Accordion
        multiple={true}
        variant="separated"
        styles={{
          label: {},
          item: {},
        }}
      >
        {interactions.map(({ description, request, response, tests }, idx) => {
          const type = getType(tests);
          return (
            <Accordion.Item
              key={idx}
              value={`interation ${idx}`}
              style={{ textAlign: "left" }}
            >
              <Accordion.Control>
                <Group spacing="xs">
                  <ThemeIcon color={typeColor[type]} size={24} radius="xl">
                    {typeIcon[type]}
                  </ThemeIcon>
                  <Text color={"blue"}>
                    {description[0].toUpperCase() + description.slice(1)}
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Accordion
                  multiple={true}
                  variant="separated"
                  styles={{
                    label: {},
                    item: {
                      width: "100%",
                      "&[data-type='error']": {
                        border: "solid red",
                      },
                      "&[data-type='warning']": {
                        border: "solid orange",
                      },
                    },
                  }}
                >
                  {tests.map(({ code, message, mockDetails, type }) => {
                    let { location, value } = mockDetails;
                    const equality = `${location} = ${JSON.stringify(value)}`;

                    return (
                      <Accordion.Item
                        key={equality}
                        value={equality}
                        data-type={type}
                      >
                        <Accordion.Control data-type={type}>
                          <Group spacing="xs">
                            <ThemeIcon
                              color={type === "error" ? "red" : "orange"}
                              size={24}
                              radius="xl"
                            >
                              {type === "error" ? (
                                <CircleX size="1rem" />
                              ) : (
                                <AlertCircle size="1rem" />
                              )}
                            </ThemeIcon>
                            <Title
                              order={5}
                              style={{
                                color: type === "error" ? "red" : "orange",
                              }}
                            >
                              {code}
                            </Title>
                          </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Text>{message}</Text>
                          <Prism language="jsx">{equality}</Prism>
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
                <Title mt={"2rem"} order={3}>
                  Request{" "}
                </Title>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack>
                    <Group spacing="xs">
                      <Text fw={700}>Method:</Text>
                      <Text>{request.method}</Text>
                    </Group>
                    <Group spacing="xs">
                      <Text fw={700}>Path:</Text>
                      <Text>{request.path}</Text>
                    </Group>
                    <Text fw={700}>Headers:</Text>
                    {request.headers ? (
                      <Prism language="json">
                        {JSON.stringify(request.headers)}
                      </Prism>
                    ) : null}
                    {request.body ? (
                      <>
                        <Text fw={700}>Body:</Text>
                        <Prism language="json">
                          {JSON.stringify(request.body)}
                        </Prism>
                      </>
                    ) : null}
                  </Stack>
                </Card>

                <Title mt={"2rem"} order={3}>
                  Expected Response
                </Title>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Stack>
                    <Group spacing="xs">
                      <Text fw={700}>Status:</Text>
                      <Text>{response.status}</Text>
                    </Group>
                    <Text fw={700}>Headers:</Text>
                    <Prism language="json">
                      {JSON.stringify(response.headers)}
                    </Prism>
                    {response.body ? (
                      <>
                        <Text fw={700}>Body:</Text>
                        <Prism language="json">
                          {JSON.stringify(response.body)}
                        </Prism>
                      </>
                    ) : null}
                  </Stack>
                </Card>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
};

Interactions.propTypes = {
  comparison: PropTypes.instanceOf(Comparison).isRequired,
};
export default Interactions;
