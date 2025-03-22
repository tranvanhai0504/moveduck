"use client";

import { useEffect } from "react";

import ResultResponse from "./result-response";
import PreviewResult from "./preview-result";
import AnimatedContent from "./animation-content";
import { useChat as useLocalChat } from "@/hooks/use-chat";
import useStep from "@/hooks/use-step";
import VideosReview from "./videos-review";

export function Chat() {
  const { clearHistory } = useLocalChat();
  const { step } = useStep();

  useEffect(() => {
    clearHistory();
  }, [clearHistory]);

  return (
    <div className="w-full grid grid-cols-3 relative z-10 gap-4 h-full px-8">
      <div className="size-full flex gap-4 col-span-2">
        <AnimatedContent
          distance={-100}
          direction="vertical"
          reverse={false}
          config={{ tension: 80, friction: 20 }}
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.2}
          className="flex-grow"
        >
          <div className="size-full bg-white/50 rounded-3xl">
            <ResultResponse />
          </div>
        </AnimatedContent>
      </div>
      <div className="size-full flex flex-col gap-4 !max-h-full">
        <AnimatedContent
          className="flex-grow"
          distance={-100}
          direction="vertical"
          reverse={false}
          config={{ tension: 80, friction: 20 }}
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.2}
          delay={1000}
        >
          <div className="size-full bg-white/50 rounded-3xl">
            {step === 3 ? (
              <div className="preview-result px-6 pt-6 size-full flex flex-col justify-center">
                <PreviewResult />
              </div>
            ) : (
              <VideosReview />
            )}
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
