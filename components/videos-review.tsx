import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { STEPS } from "@/lib/constants";
import VideoPlayer from "./video-player";
import { cn } from "@/lib/utils";

const VideosReview = () => {
  return (
    <div className={cn("h-[85dvh] overflow-y-scroll hidden-scroll flex py-4")}>
      <Accordion type="single" collapsible className="w-full" defaultValue="Create Content">
        {STEPS.map((step) => {
          return (
            <AccordionItem value={step.name} key={step.step} className="py-4">
              <AccordionTrigger className="px-16 py-0 gap-x-4">
                <span className="flex flex-col items-start text-start gap-y-1">
                  <h1 className="text-3xl font-medium">{step.label}</h1>
                  <p className="text-sm text-black/90 font-light">{step.description}</p>
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
