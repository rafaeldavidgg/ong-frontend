import "./css/Button.css";

const Button = ({ text, onClick }) => {
  return (
    <button className="btn-primary" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
