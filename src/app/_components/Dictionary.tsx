"use client";
import type { Dictionary, WordData, LanguageCode } from "@/app/_types/Words";

type Props = {
  words: Dictionary;
  language: LanguageCode;
};

const DictionaryWord: React.FC<Props> = (props) => {
  const { words, language } = props;
  return (
    <div className="border border-slate-400 p-3">
      {words.map((word: WordData) => (
        <div key={word.id} className="mb-3">
          <div className="font-bold">{word.words[language]}</div>
          <div className="text-sm text-gray-500">
            Pronunciation:{word.pronunciation[language]}
          </div>
          <div className="text-sm text-gray-500">
            Frequency: {word.frequency[language]}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default DictionaryWord;
