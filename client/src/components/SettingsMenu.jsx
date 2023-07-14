import { useState } from "react";
import PropTypes from "prop-types";
import Integration from "../models/Integration";
import { ActionIcon, Card, Title, Box, NavLink, Grid } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons-react";
import WebhooksSubmenu from "./WebhooksSubmenu.jsx";

const SettingsMenu = ({ integrations }) => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  // Add more submenus here
  const subMenus = {
    Webhooks: <WebhooksSubmenu integrations={integrations} />,
  };

  return (
    <Card>
      <ActionIcon
        variant="outline"
        onClick={() => navigate("../")}
        title="Close"
        style={{ marginLeft: "auto", marginRight: 0, display: "block" }}
      >
        <IconX size={24} />
      </ActionIcon>
      <Title order={1} style={{ margin: "auto", marginBottom: "2rem" }}>
        Settings
      </Title>
      <Grid grow>
        <Grid.Col span={1}>
          <Box w={240}>
            {Object.keys(subMenus).map((key, index) => {
              return (
                <NavLink
                  label={key}
                  key={key}
                  to={`./${key.toLowerCase()}`}
                  active={index === active}
                  onClick={() => setActive(index)}
                  component={Link}
                />
              );
            })}
          </Box>
        </Grid.Col>
        <Grid.Col span={9}>
          <Card>{Object.values(subMenus)[active]}</Card>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

SettingsMenu.propTypes = {
  integrations: PropTypes.arrayOf(PropTypes.instanceOf(Integration)).isRequired,
};

export default SettingsMenu;
