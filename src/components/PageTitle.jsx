import PropTypes from "prop-types";
import "./css/PageTitle.css";

const PageTitle = ({ title }) => {
  return <h1 className="page-title">{title}</h1>;
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
