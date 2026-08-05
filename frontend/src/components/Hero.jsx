import "./Hero.css";
import Button from "./Button";
import { Link } from "react-router-dom";
import aiImage from "../assets/images/ai-illustration.svg";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>VoiceForm AI</h1>
        <h2>Fill Any Form Using Your Voice</h2>

        <p>
          An AI-powered multilingual assistant that helps users complete
          government, college, hospital, and business forms using natural voice
          conversations.
        </p>

        <div className="buttons">
          <Link to="/forms">
            <Button text="🎤 Get Started" />
          </Link>

          <Button text="Learn More" type="secondary" />
        </div>
      </div>

      <div className="hero-right">
        <img src={aiImage} alt="VoiceForm AI" />
      </div>
    </section>
  );
}

export default Hero;