import Comparison from "../models/Comparison.js";
import { useMemo } from "react";
import { Box } from "@mantine/core";
import { CircleCheck, XboxX } from "tabler-icons-react";
import { formatDetail, formatEnvs } from "../utils/participantHelper.js";
import PropTypes from "prop-types";

import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
const Matrix = ({ comparisons }) => {
  const records = useMemo(() => {
    const records = [];

    for (const { status, consumerContract, providerSpec } of comparisons) {
      for (const {
        version: consumerVersion,
        participantBranch: consumerBranch,
        environments: consumerEnvs,
      } of consumerContract.consumerVersions) {
        for (const {
          version: providerVersion,
          participantBranch: providerBranch,
          environments: providerEnvs,
        } of providerSpec.providerVersions) {
          records.push({
            consumerVersion,
            consumerBranch: formatDetail(consumerBranch),
            providerVersion,
            providerBranch: formatDetail(providerBranch),
            status,
            consumerEnvs: formatEnvs(consumerEnvs),
            providerEnvs: formatEnvs(providerEnvs),
          });
        }
      }
    }

    return records;
  }, [comparisons]);

  const columns = useMemo(
    () => [
      {
        id: "consumer",
        header: "Consumer",
        columns: [
          {
            accessorKey: "consumerVersion",
            header: "Consumer Version",
            filterVariant: "multi-select",
            enableClickToCopy: true,
          },

          {
            accessorKey: "consumerBranch",
            header: "Consumer Branch",
            filterVariant: "multi-select",
          },
          {
            accessorKey: "consumerEnvs",
            header: "Consumer Envs",
          },
        ],
      },
      {
        id: "provider",
        header: "Provider",
        columns: [
          {
            accessorKey: "providerVersion",
            header: "Provider Version",
            filterVariant: "multi-select",
            enableClickToCopy: true,
          },

          {
            accessorKey: "providerBranch",
            header: "Provider Branch",
            filterVariant: "multi-select",
          },
          {
            accessorKey: "providerEnvs",
            header: "Provider Envs",
          },
        ],
      },
      {
        id: "status",
        header: "",
        columns: [
          {
            accessorKey: "status",
            header: "Status",
            filterVariant: "multi-select",
            Cell: ({ cell }) =>
              cell.getValue() === "Success" ? (
                <CircleCheck color={"#4caf50"} />
              ) : (
                <XboxX color={"#f44336"} />
              ),
          },
        ],
      },
    ],

    []
  );

  const table = useMantineReactTable({
    columns,
    data: records,
    enableFacetedValues: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
  });

  return (
    <Box mt="lg" style={{ textAlign: "left" }}>
      <MantineReactTable table={table} />
    </Box>
  );
};

Matrix.propTypes = {
  comparisons: PropTypes.arrayOf(PropTypes.instanceOf(Comparison)).isRequired,
};

export default Matrix;
