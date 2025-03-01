"use client";

import type { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import type { Vote } from "@/lib/db/schema";
import { fetcher } from "@/lib/utils";

import { Block } from "./block";
import { MultimodalInput } from "./multimodal-input";
import { Messages } from "./messages";
import type { VisibilityType } from "./visibility-selector";
import { useBlockSelector } from "@/hooks/use-block";
import { useWallet } from "@razorlabs/razorkit";
import ResultResponse from "./result-response";
import PreviewResult from "./preview-result";
import AnimatedContent from "./animation-content";

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const wallet = useWallet();

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, modelId: selectedModelId, userId: wallet.address },
    initialMessages,
    experimental_throttle: 100,
    onFinish: () => {
      mutate("/api/history");
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isBlockVisible = useBlockSelector((state) => state.isVisible);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-[#F4F5F7] p-4 overflow-hidden">
        <div className="w-full h-dvh grid grid-cols-2 relative z-10 gap-4 ">
          <div className="size-full flex flex-col gap-4">
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
              <div className="size-full bg-white rounded-2xl shadow">
                <ResultResponse />
              </div>
            </AnimatedContent>
            <AnimatedContent
              delay={500}
              distance={20}
              direction="vertical"
              reverse={false}
              config={{ tension: 80, friction: 20 }}
              initialOpacity={0}
              animateOpacity
              scale={1}
              threshold={0.2}
              className=""
            >
              <form className="flex mx-auto gap-2 w-full bg-white rounded-2xl shadow">
                {!isReadonly && (
                  <MultimodalInput
                    chatId={id}
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    stop={stop}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    messages={messages}
                    setMessages={setMessages}
                    append={append}
                  />
                )}
              </form>
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
              <div className="size-full bg-white rounded-2xl shadow">
                <PreviewResult />
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>

      <Block
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
