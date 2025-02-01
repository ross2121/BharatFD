import translate from "google-translate-api-x";


const translateText = async (text:string, lang:string) => {
  if (lang === "en") return text;
  try {
    const { text: translatedText } = await translate(text, { to: lang });
    return translatedText;
  } catch (error) {
    return text; 
  }
};

export default translateText;