import Comparison from "../models/Comparison.js";
import ComparisonContainer from "./ComparisonContainer.jsx";
import PropTypes from "prop-types";

const latest = (array) => array.sort((a, b) => b.createdAt - a.createdAt)[0];

/**
 * @function IntegrationOverviewTab
 * @description Renders a list of ComparisonContainer components.
 * @param {object} props
 * @param {Comparison[]} props.comparisons
 * @returns {React.ReactHTMLElement}
 */
const IntegrationOverviewTab = ({ comparisons, onViewContracts }) => {
  return (
    <div>
      {comparisons
        .sort(
          (a, b) =>
            (latest(b.providerSpec.providerVersions)?.createdAt ||
              b.providerSpec.createdAt) -
            (latest(a.providerSpec.providerVersions)?.createdAt ||
              a.providerSpec.createdAt)
        )
        .map((comparison) => (
          <ComparisonContainer
            key={comparison.id}
            comparison={comparison}
            onViewContracts={onViewContracts}
          />
        ))}
    </div>
  );
};

IntegrationOverviewTab.propTypes = {
  comparisons: PropTypes.arrayOf(PropTypes.instanceOf(Comparison)).isRequired,
  onViewContracts: PropTypes.func.isRequired,
};

export default IntegrationOverviewTab;
