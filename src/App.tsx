import { useState, useEffect } from 'react';
import './index.css'; 

type FlashcardData = {
    da: string; 
    ru: string; 
    en: string; 
};

type TranslationLanguage = "ru" | "en";

function App() {
  const [words, setWords] = useState<FlashcardData[]>(() => {
    const saved = localStorage.getItem("myDanishWords");
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {da: "Kat", ru: "Кошка", en: "Cat"},
      {da: "Hund", ru: "Собака", en: "Dog"},
      {da: "Fugl", ru: "Птица", en: "Bird"},
      {da: "Hus", ru: "Дом", en: "House"},
      {da: "Bil", ru: "Машина", en: "Car"}
    ];
  });

  const [currentIndex, setCurrentIndex] = useState(1);
  const [language, setLanguage] = useState<TranslationLanguage>('ru');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputDa, setInputDa] = useState("");
  const [inputRu, setInputRu] = useState("");
  const [inputEn, setInputEn] = useState("");

  useEffect(() => {
    localStorage.setItem("myDanishWords", JSON.stringify(words));
  }, [words]);

  const prevIndex = (currentIndex - 1 + words.length) % words.length;
  const nextIndex = (currentIndex + 1) % words.length;

  const prevWord = words[prevIndex];
  const currentWord = words[currentIndex];
  const nextWord = words[nextIndex];

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + words.length) % words.length);
    setIsFlipped(false);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % words.length);
    setIsFlipped(false);
  };

  const handleSaveWord = () => {
    if (inputDa.trim() === "" || inputRu.trim() === "" || inputEn.trim() === "") return;
    
    setWords([...words, { da: inputDa, ru: inputRu, en: inputEn }]);
    setIsModalOpen(false);
    setInputDa("");
    setInputRu("");
    setInputEn("");
  };

  return (
    <div className="app-container">
      <div className="lang-switcher">
        <img 
          src="https://flagcdn.com/w40/ru.png" 
          className={`flag ${language === 'ru' ? 'active' : ''}`} 
          alt="Русский" 
          title="Русский"
          onClick={() => setLanguage('ru')}
        />
        <img 
          src="https://flagcdn.com/w40/gb.png" 
          className={`flag ${language === 'en' ? 'active' : ''}`} 
          alt="English" 
          title="English"
          onClick={() => setLanguage('en')}
        />
      </div>

      <h1>Danish cards</h1>
      
      <div className="carousel">
        <button className="arrow-btn" onClick={handlePrev}>◀</button>
        
        <div className="card-container side-card">
          <div className="flashcard">
            <div className="front">{prevWord.da}</div>
            <div className="back">{prevWord[language]}</div>
          </div>
        </div>
        
        <div className="card-container main-card">
          <div 
            className={`flashcard ${isFlipped ? 'flip' : ''}`} 
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="front">{currentWord.da}</div>
            <div className="back">{currentWord[language]}</div>
          </div>
        </div>
        
        <div className="card-container side-card">
          <div className="flashcard">
            <div className="front">{nextWord.da}</div>
            <div className="back">{nextWord[language]}</div>
          </div>
        </div>
        
        <button className="arrow-btn" onClick={handleNext}>▶</button>
      </div>

      <button className="add-btn" onClick={() => setIsModalOpen(true)}>Add word</button>
      
      <div className={`modal ${!isModalOpen ? 'hidden' : ''}`}>
        <div className="modal-content">
          <h2>New word</h2>
          <input 
            type="text" 
            placeholder="Danish (example: Æble)" 
            value={inputDa}
            onChange={(e) => setInputDa(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Russian (example: Яблоко)" 
            value={inputRu}
            onChange={(e) => setInputRu(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="English (example: Apple)" 
            value={inputEn}
            onChange={(e) => setInputEn(e.target.value)}
          />
          <div className="modal-actions">
            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>cancel</button>
            <button className="save-btn" onClick={handleSaveWord}>save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
