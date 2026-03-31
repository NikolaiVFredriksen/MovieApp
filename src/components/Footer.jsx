import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "1.75rem",
        padding: "24px 20px",
        textAlign: "center",
        borderTop: "0.3px solid rgba(255,255,255,0.08)",
        background:
          "radial-gradient(ellipse at bottom, rgba(171,139,255,0.08), transparent 70%)",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.5)",
          margin: 0,
        }}
      >
        Made with 🍿 for movie lovers
      </p>

      <p
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.35)",
          marginTop: "6px",
        }}
      >
        © {new Date().getFullYear()} Nikolai Villanueva Fredriksen
      </p>
    </footer>
  );
};

export default Footer;
