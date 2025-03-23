import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { STEPS, VIDEO_STEP } from "@/lib/constants";
import VideoPlayer from "./video-player";
import { cn } from "@/lib/utils";
import useStep from "@/hooks/use-step";

const VideosReview = () => {
  const { step } = useStep();
  const [selectedStep, setSelectedStep] = React.useState<number>(0);

  useEffect(() => {
    setSelectedStep(step - 1);
  }, [step]);

  return (
    <div className={cn("h-[85dvh] overflow-y-scroll hidden-scroll flex py-4")}>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={VIDEO_STEP[selectedStep].name}
        value={VIDEO_STEP[selectedStep].name}
      >
        {VIDEO_STEP.map((step) => {
          return (
            <AccordionItem value={step.name} key={step.step} className="py-4">
              <AccordionTrigger
                className="px-16 py-0 gap-x-4"
                onClick={() => {
                  setSelectedStep(step.step - 1);
                }}
              >
                <span className="flex flex-col items-start text-start gap-y-1">
                  <h1 className="text-3xl font-medium">{step.label}</h1>
                  <p className="text-sm text-black/90 font-light">
                    {step.description}
                  </p>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <VideoPlayer src="/videos/sample.mp4" />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default VideosReview;
