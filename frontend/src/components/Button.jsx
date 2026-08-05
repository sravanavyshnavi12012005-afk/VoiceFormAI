import "./Button.css";
function Button({ text, type = "primary", onClick }) {
  return (
    <button className={`btn ${type}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;