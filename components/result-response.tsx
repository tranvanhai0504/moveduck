import React from "react";
import { STEPS } from "@/lib/constants";
import useStep from "@/hooks/use-step";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const ResultResponse = () => {
  const { step, nextStep, prevStep } = useStep();

  return (
    <div className="size-full flex flex-col p-4">
      <div className="grow">
        <ScrollArea className="w-full h-96 pe-2">
          <h1 className="font-semibold text-2xl text-muted-foreground">
            Step {step}: {STEPS[step - 1].description}
          </h1>
          <div className=""></div>
        </ScrollArea>
      </div>
      <div className="flex justify-between px-2 font-semibold">
        <Button
          className={cn("btn h-fit !p-0 bg-transparent text-black hover:bg-transparent")}
          onClick={prevStep}
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button
          className={cn(
            "btn h-fit !p-0 bg-transparent text-primary hover:bg-transparent"
          )}
          onClick={nextStep}
          disabled={step === STEPS.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ResultResponse;
