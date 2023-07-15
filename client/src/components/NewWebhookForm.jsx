import { useState } from "react";
import PropTypes from "prop-types";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  TextInput,
  Stack,
  Checkbox,
  Group,
  Textarea,
  JsonInput,
  Button,
  Select,
  Text,
} from "@mantine/core";

import Integration from "../models/Integration.js";
import { webhookService } from "../services/apiService.js";

const NewWebhookForm = ({ integrations }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: {
      integrationId: undefined,
      events: ["comparison", "specPublish", "providerVerification"],
      url: "",
      enabled: true,
      description: "",
      headers: "Content-Type: application/json",
      payload: "",
    },
    validate: {
      integrationId: isNotEmpty("You must select an integration"),
      events: isNotEmpty("You must select at least one event"),
      url: isNotEmpty("You must enter a URL"),
    },
    transformValues: (values) => {
      const result = { ...values };
      result.events = result.events.reduce((acc, event) => {
        acc[event] = true;
        return acc;
      }, {});
      return result;
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setError(null);
    try {
      await webhookService.postNewWebhook(values);
      setSubmitted(true);
    } catch (error) {
      setError(error);
    }
  });

  const eventCheckBoxProps = {
    styles: () => ({
      label: {
        cursor: "pointer",
      },
      input: {
        cursor: "pointer",
      },
      root: {
        marginBottom: "0.5rem",
      },
    }),
  };

  if (!submitted) {
    return (
      <form onSubmit={handleSubmit}>
        <Stack mx="auto">
          <TextInput
            {...form.getInputProps("description")}
            label="Description"
            placeholder="Description"
          />

          <TextInput
            {...form.getInputProps("url")}
            label="URL"
            placeholder="http://example.com/api/webhooks"
            required
          />

          <Select
            {...form.getInputProps("integrationId")}
            required
            label="Integration"
            data={integrations.map((integration) => {
              return {
                label: integration.name,
                value: integration.id,
              };
            })}
          />

          <Checkbox.Group
            label="Events"
            required
            {...form.getInputProps("events", { type: "checkbox" })}
            defaultValue={["comparison", "specPublish", "providerVerification"]}
          >
            <Checkbox
              label="New spec published"
              value="specPublish"
              {...eventCheckBoxProps}
            />
            <Checkbox
              label="New comparison published"
              value="comparison"
              {...eventCheckBoxProps}
            />
            <Checkbox
              label="New provider verification"
              value="providerVerification"
              {...eventCheckBoxProps}
            />
          </Checkbox.Group>

          <Textarea
            {...form.getInputProps("headers")}
            label="Headers"
            placeholder="Header-name: Value"
          />

          <JsonInput
            {...form.getInputProps("payload")}
            label="Payload (JSON)"
            placeholder={'{\n  "key": "value"\n}'}
            validationError="Invalid JSON"
            formatOnBlur
            autosize
            minRows={4}
          />

          <Checkbox
            {...form.getInputProps("enabled", { type: "checkbox" })}
            label="Enabled"
            disabled
          />

          <Group position="center" mt="md">
            <Button type="submit">Create</Button>
          </Group>

          {error && (
            <Group position="center" mt="md">
              <Text color="red" fw={"bold"}>
                Error: Failed to create webhook. {error.message}.
              </Text>
            </Group>
          )}
        </Stack>
      </form>
    );
  } else {
    return (
      <Text color="green" fw={"bold"}>
        Webhook successfully created
      </Text>
    );
  }
};

NewWebhookForm.propTypes = {
  integrations: PropTypes.arrayOf(PropTypes.instanceOf(Integration)).isRequired,
};

export default NewWebhookForm;
