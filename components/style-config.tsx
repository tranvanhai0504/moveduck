import React from "react";
import useResultStore from "@/stores/use-result-store";
import { TStyle, STYLES } from "@/types/style";
import Image from "next/image";
import { Button } from "./ui/button";
import useStep from "@/hooks/use-step";

const StyleConfig = () => {
  const { data, setResult } = useResultStore();
  const { nextStep } = useStep();

  const handleStyleSelect = (style: TStyle) => {
    setResult({ ...data, style: style, image: style.image });
  };

  const handleNextStep = () => {
    nextStep();
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full mt-10 flex gap-x-4">
        {STYLES.map((style: TStyle, index: number) => {
          const isSelected = data?.style?.id === style.id;
          return (
            <div
              key={style.id}
              className={`size-32 rounded-2xl relative overflow-hidden cursor-pointer border-4 ${
                isSelected ? " border-blue-500" : "border-transparent"
              }`}
              onClick={() => handleStyleSelect(style)}
            >
              <Image
                src={style.image}
                alt="img"
                fill
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
      <Button onClick={handleNextStep} className="text-black rounded-full">
        Next Step
      </Button>
    </div>
  );
};

export default StyleConfig;
