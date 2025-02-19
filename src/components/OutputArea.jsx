const OutputArea = ({ text, detectedLanguage }) => {
  return (
    <div>
      <p>{text}</p>
      <p>Detected Language: {detectedLanguage || "Unknown"}</p>
    </div>
  );
};

export default OutputArea;