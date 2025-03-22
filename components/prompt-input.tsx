import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { MoveRight } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import useStep from "@/hooks/use-step";

function SendButton({
  submitForm,
  input,
}: {
  submitForm: () => void;
  input: string;
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0}
    >
      <MoveRight size={14} className="!text-black" />
    </Button>
  );
}

const PromptInput = ({ className }: { className?: string }) => {
  const [input, setInput] = useState("");
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage } = useChat();
  const { step, nextStep } = useStep();

  const submitForm = async () => {
    if (step === 1) {
      nextStep();
    }

    if (!wallet.connected) {
      toast.error("Please connect your wallet!");
      return;
    }

    if (input.trim() === "") {
      toast.error("Please enter a message!");
      return;
    }

    setIsLoading(true);

    await sendMessage(input);

    setInput("");
    setIsLoading(false);
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      <Textarea
        placeholder="Enter your prompt"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={cn(
          "min-h-[24px] max-h-[calc(14dvh)] overflow-hidden resize-none p-4 !pe-14 rounded-2xl !text-base border-0",
          className
        )}
        disabled={!wallet.connected}
        rows={1}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error("Please wait for the model to finish its response!");
            } else {
              submitForm();
            }
          }
        }}
      />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 p-2 w-fit flex flex-row justify-end">
        <SendButton input={input} submitForm={submitForm} />
      </div>
    </div>
  );
};

export default PromptInput;
