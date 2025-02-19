

// detectLanguage 

export const detectLanguage = async (text) => {
  try {
    const capabilities = await self.ai.languageDetector.capabilities();
    const canDetect = capabilities;

    let detector;

    if (canDetect === "no") {
      console.log("No language detected");
      return { detectedLanguage: null }; // Return a default value
    }

    if (canDetect === "readily") {
      console.log("Readily language detected");
      detector = await self.ai.languageDetector.create();
    } else {
      console.log("Readily language not detected");
      detector = await self.ai.languageDetector.create({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
          });
        },
      });
    }

    await detector.ready;
    console.log('Language detector is ready.');

    // Detect the language of the input text
    const detectedLanguages = await detector.detect(text);
    console.log('Detected Languages:', detectedLanguages);

    // Extract the most likely detected language (first item in the array)
    const mostLikelyLanguage = detectedLanguages[0]?.detectedLanguage || null;

    // Return the detected language in a structured format
    return { detectedLanguage: mostLikelyLanguage };
  } catch (error) {
    console.error('Error during language detection:', error);
    return { detectedLanguage: null }; // Return a default value in case of error
  }
};


//summarizeText

export const summarizeText = async (text) => {
  const summarizer = await window.ai.summarizer.create({
    monitor(m) {
      m.addEventListener('downloadprogress', (e) => {
        console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
      });
    }
  });

  return summarizer.summarize(text); 
}



//translation  function

export async function translateText(text, sourceLanguage = 'en', targetLanguage = 'es', retryCount = 0) {
  try {
    // No translation needed if source and target languages are the same
    if (sourceLanguage === targetLanguage) {
      return text;
    }

    // Check if the translator API is available
    if (!('ai' in self) || !('translator' in self.ai)) {
      throw new Error("Translator API is not available.");
    }

    console.log("Creating translator instance...");

    // Try direct translation first
    try {
      const translator = await self.ai.translator.create({
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
      });

      if (typeof translator.translate !== "function") {
        throw new Error("translator.translate is not a function.");
      }

      const translatedText = await translator.translate(text);
      console.log(`Translated text: ${translatedText}`);
      return translatedText;
    } catch (directError) {
      console.warn("Direct translation failed. Trying intermediate translation...");

      // Define intermediate language (e.g., English)
      const intermediateLanguage = 'en';

      // Prevent infinite recursion by limiting retries
      if (retryCount >= 2) {
        throw new Error("Maximum retry attempts reached. Translation failed.");
      }

      // Translate from source to intermediate
      const intermediateText = await translateText(
        text,
        sourceLanguage,
        intermediateLanguage,
        retryCount + 1 // Increment retry count
      );

      // Translate from intermediate to target
      const finalText = await translateText(
        intermediateText,
        intermediateLanguage,
        targetLanguage,
        retryCount + 1 // Increment retry count
      );

      console.log(`Translated text (via intermediate): ${finalText}`);
      return finalText;
    }
  } catch (error) {
    console.error("Translation failed:", error.message);
    return text; // Return the original text as a fallback
  }
}