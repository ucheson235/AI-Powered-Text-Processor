import InputField from "./components/InputField";
import Button from "./components/Button";
import { FaPaperPlane } from "react-icons/fa";
import OutputArea from "./components/OutputArea";
import LanguageSelect from "./components/LanguageSelect";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { detectLanguage, summarizeText, translateText } from "./utils/api";

// Language mapping
const languageMap = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  ru: "Russian",
  tr: "Turkish",
  // Add more languages as needed
};

// Reverse language mapping (full name to code)
const reverseLanguageMap = Object.fromEntries(
  Object.entries(languageMap).map(([code, name]) => [name, code])
);

function App() {
  // State variables
  const [inputText, setInputText] = useState(""); 
  const [outputText, setOutputText] = useState(""); 
  const [detectedLang, setDetectedLang] = useState(""); 
  const [detectedLangCode, setDetectedLangCode] = useState(""); 
  const [selectedLanguage, setSelectedLanguage] = useState("en"); 
  const [isLoading, setIsLoading] = useState(false); 

  // Handle input text change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle language selection change
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  // Handle sending text for processing
  const handleSendText = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text.");
      return;
    }

    setIsLoading(true);

    try {
      // Call detectLanguage and get the result
      const detectionResult = await detectLanguage(inputText);
      console.log("Detection Result:", detectionResult);

      // Check if the detected language is valid
      if (!detectionResult || !detectionResult.detectedLanguage) {
        toast.warn("Language detection failed. Defaulting to English.");
        setDetectedLang("English"); 
        setDetectedLangCode("en"); 
      } else {
        // Convert the language code to the full name
        const fullLanguageName = languageMap[detectionResult.detectedLanguage] || "Unknown";
        setDetectedLang(fullLanguageName);
        setDetectedLangCode(detectionResult.detectedLanguage); 
      }

      // Set the output text
      setOutputText(inputText);
    } catch (err) {
      toast.error("Failed to process text. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle summarizing text
  const handleSummarize = async () => {
    if (!outputText || detectedLangCode !== "en") {
      toast.error("Summarization is only available for English text.");
      return;
    }

    setIsLoading(true);
    toast.success("Summarization is available for English");

    try {
      const summary = await summarizeText(outputText);
      setOutputText(summary); 
    } catch (err) {
      toast.error("Failed to summarize text. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle translating text
  const handleTranslate = async () => {
    if (!outputText) {
      toast.error("No text to translate.");
      return;
    }

    setIsLoading(true);

    try {
      // Translate the text
      const translatedText = await translateText(outputText, detectedLangCode, selectedLanguage);
      setOutputText(translatedText);
      toast.success("Translated successfully");
    } catch (err) {
      toast.error(err.message); 
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resetting the app state
  const handleReset = () => {
    setInputText(""); 
    setOutputText(""); 
    setDetectedLang(""); 
    setDetectedLangCode(""); 
    setSelectedLanguage("en"); 
    toast.info("well Refresh!!");
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="p-4">
        <div className="max-w-2xl mx-auto bg-transparent p-6 rounded-lg shadow-md text-white border-2 border-gray-600">
          <h1 className="text-2xl font-bold text-center mb-6">
            AI-Powered Text Processor
          </h1>

          {/* Input Field */}
          <div className="mb-4">
            <InputField
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter text to process..."
            />
          </div>

          {/* Send Button */}
          <div className="flex justify-end mb-4">
            <Button onClick={handleSendText} disabled={isLoading}>
              <FaPaperPlane className="inline-block mr-2" /> Send
            </Button>
          </div>

          {/* Output Area */}
          {outputText && (
            <div className="mb-4">
              <OutputArea text={outputText} detectedLanguage={detectedLang} />
            </div>
          )}

          {/* Action Buttons */}
          {outputText && (
            <div className="flex flex-col space-y-4">
              {/* Reset Button */}
              <Button onClick={handleReset} disabled={isLoading}>
                 Refresh  
              </Button>

              {/* Translate Section */}
              <div className="flex items-center space-x-4">
                <LanguageSelect
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                />
                <Button onClick={handleTranslate} disabled={isLoading}>
                  Translate
                </Button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <p className="text-gray-600 text-sm mt-4">Processing...</p>
          )}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </div>
    </div>
  );
}

export default App;