import React, { useState } from "react";
import { Button } from "./ui/button";
import useResultStore from "@/stores/use-result-store";

const COLORS = [
  "#000000",
  "#FFDA34",
  "#F4A625",
  "#39D4FF",
  "#4301FF",
  "#FF4C57",
  "#84FF59",
  "#ffffff",
];

const StyleConfig = () => {
  const { data, setResult } = useResultStore();
  const [selectedTextColor, setSelectedTextColor] = useState<string>(
    data.color?.textColor ?? ""
  );
  const [selectedBgColor, setSelectedBgColor] = useState<string>(
    data.color?.backgroundColor ?? ""
  );

  const [selectedButtonBgColor, setSelectedButtonBgColor] = useState<string>(
    data.color?.buttonBackgroundColor ?? ""
  );

  const handleChooseTextColor = (color: string) => {
    setSelectedTextColor(color);
    setResult({
      ...data,
      color: {
        ...data.color,
        textColor: color,
      },
    });
  };

  const handleChooseBgColor = (color: string) => {
    setSelectedBgColor(color);
    setResult({
      ...data,
      color: {
        ...data.color,
        backgroundColor: color,
      },
    });
  };

  const handleChooseButtonBgColor = (color: string) => {
    setSelectedButtonBgColor(color);
    setResult({
      ...data,
      color: {
        ...data.color,
        buttonBackgroundColor: color,
      },
    });
  };

  return (
    <div className="w-full mt-10">
      <div className="rounded-2xl border-2 border-black w-3/4 mx-auto p-10 space-y-4">
        <h1 className="text-xl font-medium">Feature:</h1>
        <div className="w-full flex justify-between items-center gap-x-4">
          <Button className="rounded-full border-2 text-black border-black bg-primary flex-grow !py-1">
            QUIZZ
          </Button>
          <Button
            className="rounded-full text-black bg-muted flex-grow !py-1"
            disabled
          >
            SWAP
          </Button>
          <Button
            className="rounded-full text-black bg-muted flex-grow !py-1"
            disabled
          >
            BUY
          </Button>
        </div>
        <h1 className="text-xl font-medium">Text Color:</h1>
        <div className="flex gap-x-2">
          {COLORS.map((color, index) => (
            <div
              key={index}
              className={`size-8 rounded-full cursor-pointer ${
                selectedTextColor === color
                  ? `border-2 ${
                      color === "#000000" ? "border-white" : "border-black"
                    }`
                  : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleChooseTextColor(color)}
            />
          ))}
        </div>
        <h1 className="text-xl font-medium">Background Color:</h1>
        <div className="flex gap-x-2">
          {COLORS.map((color, index) => (
            <div
              key={index}
              className={`size-8 rounded-full cursor-pointer ${
                selectedBgColor === color
                  ? `border-2 ${
                      color === "#000000" ? "border-white" : "border-black"
                    }`
                  : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleChooseBgColor(color)}
            />
          ))}
        </div>

        <h1 className="text-xl font-medium">Button Background Color:</h1>
        <div className="flex gap-x-2">
          {COLORS.map((color, index) => (
            <div
              key={index}
              className={`size-8 rounded-full cursor-pointer ${
                selectedButtonBgColor === color
                  ? `border-2 ${
                      color === "#000000" ? "border-white" : "border-black"
                    }`
                  : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleChooseButtonBgColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleConfig;
