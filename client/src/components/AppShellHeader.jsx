import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import {
  Anchor,
  Header,
  MediaQuery,
  Burger,
  Flex,
  Image,
  Group,
} from "@mantine/core";
import { ActionIcon, Button } from "@mantine/core";
import { IconSun, IconMoonStars, IconSettings } from "@tabler/icons-react";

const AppShellHeader = ({
  navbarOpened,
  setNavbarOpened,
  theme,
  toggleColorScheme,
  dark,
}) => {
  const navigate = useNavigate();

  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={navbarOpened}
            onClick={() => setNavbarOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Link to={"/"}>
          <Anchor component="span">
            <Group>
              <Image src="/transparent-logo-horizontal-mn.svg" height={97} />
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
            {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
          </ActionIcon>
        </Flex>
      </div>
    </Header>
  );
};

AppShellHeader.propTypes = {
  navbarOpened: PropTypes.bool.isRequired,
  setNavbarOpened: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  toggleColorScheme: PropTypes.func.isRequired,
  dark: PropTypes.bool.isRequired,
};

export default AppShellHeader;
