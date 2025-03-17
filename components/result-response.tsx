import React, { useEffect, useRef, useState } from "react";
import { STEPS } from "@/lib/constants";
import useStep from "@/hooks/use-step";
import { cn } from "@/lib/utils";
import ContentGenerate from "./content-generate";
import StyleConfig from "./style-config";
import ActionResponse from "./action-response";
import PromptInput from "./prompt-input";
import { ArrowBigDown, ArrowBigUp, ArrowDown, ArrowUp } from "lucide-react";

const StepContainer = ({
  children,
  title,
  description,
  stepIndex,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  stepIndex: number;
}) => {
  const { step } = useStep();

  return (
    <div
      className={cn(
        "flex flex-col gap-y-4 px-2 mt-10 relative z-20",
        step !== stepIndex && "opacity-30"
      )}
    >
      {step !== stepIndex && (
        <div className="size-full absolute top-0 left-0 z-30" />
      )}

      <span className="flex flex-col items-start px-4">
        <h1 className="text-3xl font-medium">{title}</h1>
        <p className="text-sm mt-2 !text-start">{description}</p>
      </span>
      {children}
    </div>
  );
};

const ResultResponse = () => {
  const { step } = useStep();
  const [currentPosition, setCurrentPosition] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const [isShowButton, setIsShowButton] = useState<-1 | 0 | 1>(0);

  useEffect(() => {
    if (!parentRef.current) return;

    let totalHeight = 0;
    for (let i = 0; i < parentRef.current.children.length; i++) {
      if (step === 1) break;
      if (i >= step) continue;
      totalHeight += parentRef.current.children[i].clientHeight || 0;
    }
    setCurrentPosition(totalHeight);
    parentRef.current.scrollTo({
      top: totalHeight,
      behavior: "smooth",
    });
  }, [step]);

  useEffect(() => {
    if (!parentRef.current) return;

    parentRef.current.onscroll = () => {
      if (!parentRef.current?.scrollTop) return;

      let refScrollTop = Math.floor(parentRef.current?.scrollTop);

      if (refScrollTop === currentPosition) setIsShowButton(0);
      else if (refScrollTop > currentPosition) setIsShowButton(1);
      else setIsShowButton(-1);
    };

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (parentRef.current) parentRef.current.onscroll = null;
    };
  }, [parentRef.current?.scrollTop, currentPosition]);

  const handleBackToCurrentStep = () => {
    if (!parentRef.current) return;

    parentRef.current.scrollTo({
      top: currentPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="size-full flex flex-col py-6 3xl:py-10 px-32 relative">
      <div
        ref={parentRef}
        className="size-full h-[82dvh] pe-3 overflow-x-scroll hidden-scroll"
      >
        <div className="h-40 w-full" />
        <StepContainer
          title={STEPS[0].label}
          description={STEPS[0].description as string}
          stepIndex={1}
        >
          <PromptInput />
        </StepContainer>
        <StepContainer
          title={STEPS[1].label}
          description={STEPS[1].description as string}
          stepIndex={2}
        >
          <ContentGenerate />
          <PromptInput />
        </StepContainer>
        <StepContainer
          title={STEPS[2].label}
          description={STEPS[2].description as string}
          stepIndex={3}
        >
          <StyleConfig />
        </StepContainer>
        <StepContainer
          title={STEPS[3].label}
          description={STEPS[3].description as string}
          stepIndex={4}
        >
          <ActionResponse />
        </StepContainer>
      </div>

      {isShowButton !== 0 && (
        <div
          onClick={handleBackToCurrentStep}
          className="absolute p-2 rounded-full bg-primary bottom-4 right-4 cursor-pointer"
        >
          {isShowButton === 1 ? <ArrowUp /> : <ArrowDown />}
        </div>
      )}
    </div>
  );
};

export default ResultResponse;
