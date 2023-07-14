import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Anchor,
  AppShell,
  Navbar,
  Header,
  // Footer,
  // Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Flex,
  Image,
  Group,
} from "@mantine/core";
import IntegrationNavLinks from "./IntegrationNavLinks.jsx";
import { ActionIcon, useMantineColorScheme, Button } from "@mantine/core";
import { IconSun, IconMoonStars, IconSettings } from "@tabler/icons-react";
import Integration from "../models/Integration.js";

const MyAppShell = ({ children, integrations }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const navigate = useNavigate();

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Text style={{ opacity: "50%" }}>Integrations</Text>
          <IntegrationNavLinks integrations={integrations} />
        </Navbar>
      }
      // aside={
      //   <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      //       <Text>Application sidebar</Text>
      //     </Aside>
      //   </MediaQuery>
      // }
      // footer={
      //   <Footer height={60} p="md">
      //     Application footer
      //   </Footer>
      // }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Link to={"/"}>
              <Anchor component="span">
                <Group>
                  <Image
                    src="/transparent-logo-horizontal-mn.svg"
                    height={97}
                  />
                </Group>
              </Anchor>
            </Link>
            <Flex style={{ marginLeft: "auto" }}>
            <Button
                className="deploy-guard-button"
                variant="outline"
                color={dark ? "yellow" : "blue"}
                onClick={() => navigate("/deploy-guard")}
                style={{
                  marginRight: "2rem",
                  transition: "background-color 0.2s, color 0.2s",
                }}
              >
                Deploy Guard
              </Button>
              <ActionIcon
                variant="outline"
                color={dark ? "yellow" : "blue"}
                onClick={() => navigate("/settings")}
                title="Settings"
                style={{ marginRight: "2rem" }}
              >
                <IconSettings />
              </ActionIcon>
              <ActionIcon
                variant="outline"
                color={dark ? "yellow" : "blue"}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {dark ? (
                  <IconSun size="1.1rem" />
                ) : (
                  <IconMoonStars size="1.1rem" />
                )}
              </ActionIcon>
            </Flex>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

MyAppShell.propTypes = {
  children: PropTypes.node.isRequired,
  integrations: PropTypes.arrayOf(PropTypes.instanceOf(Integration)).isRequired,
};

export default MyAppShell;
