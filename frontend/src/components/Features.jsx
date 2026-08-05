import FeatureCard from "./FeatureCard";

function Features() {
  return (
    <section
      style={{
        padding: "80px 20px",
        textAlign: "center",
      }}
    >
      <h2>Why Choose VoiceForm AI?</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          marginTop: "40px",
        }}
      >
        <FeatureCard
          icon="🎤"
          title="Voice Input"
          description="Fill forms simply by speaking."
        />

        <FeatureCard
          icon="🌍"
          title="Multiple Languages"
          description="Supports English, Telugu, Hindi and more."
        />

        <FeatureCard
          icon="📄"
          title="Smart Form Filling"
          description="AI fills every field automatically."
        />

        <FeatureCard
          icon="🔒"
          title="Secure"
          description="Your data stays private and protected."
        />
      </div>
    </section>
  );
}

export default Features;