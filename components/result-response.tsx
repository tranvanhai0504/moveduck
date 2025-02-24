import React, { useState } from "react";
import { STEPS } from "@/lib/constants";
import useStep from "@/hooks/use-step";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import SplitText from "./split-text";
import AnimatedContent from "./animation-content";
import ImageGenerator from "./images-generate";

const ResultResponse = () => {
  const { step, nextStep, prevStep } = useStep();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNextStep = () => {
    nextStep();
    setIsTransitioning(false);
  };

  return (
    <div className="size-full flex flex-col py-10 px-4">
      <ScrollArea className="size-full h-96 pe-2 flex-grow">
        {step === 1 && (
          <>
            <SplitText
              text={`Step ${step}: ${STEPS[step - 1].description}`}
              className="font-semibold text-2xl text-muted-foreground"
              delay={15}
              animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              threshold={0.2}
              rootMargin="-50px"
              onLetterAnimationComplete={() => {
                setIsTransitioning(true);
              }}
            />
            {
              isTransitioning && (
                <AnimatedContent distance={150} direction="horizontal" reverse={false} config={{ tension: 80, friction: 20 }} initialOpacity={0} animateOpacity scale={1.1} threshold={0.2} >
                  <p className="text-black/50 text-lg mt-4">Loren ipsun dolor sit anet, consectetur adipisci elit, sed eiusnod tenpor incidunt ut labore et dolore nagna aliqua. Ut enin ad ninin venian, quis nostrun exercitationen ullan corporis suscipit laboriosan, nisi ut aliquid ex ea connodi consequatur</p>
                </AnimatedContent>
              )
            }
          </>
        )}
        {step === 2 && (
          <>
            <SplitText
              text={`Step ${step}: ${STEPS[step - 1].description}`}
              className="font-semibold text-2xl text-muted-foreground"
              delay={15}
              animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              threshold={0.2}
              rootMargin="-50px"
              onLetterAnimationComplete={() => {
                setIsTransitioning(true);
              }}
            />
            {
              isTransitioning && (
                <AnimatedContent distance={150} direction="horizontal" reverse={false} config={{ tension: 80, friction: 20 }} initialOpacity={0} animateOpacity scale={1.1} threshold={0.2} >
                  <ImageGenerator />
                </AnimatedContent>
              )
            }
          </>
        )}
      </ScrollArea>
      <div className="flex justify-between px-2 font-semibold mt-4">
        <Button
          className={cn("btn h-fit !p-0 bg-transparent text-black hover:bg-transparent")}
          onClick={() => {
            prevStep();
            setIsTransitioning(false);
          }}
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button
          className={cn(
            "btn h-fit !p-0 bg-transparent text-primary hover:bg-transparent"
          )}
          onClick={handleNextStep}
          disabled={step === STEPS.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ResultResponse;
