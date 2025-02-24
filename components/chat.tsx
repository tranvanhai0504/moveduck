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
import VariantsComponent from "./VariantsComponent";
import ResultResponse from "./result-response";
import PreviewResult from "./preview-result";

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
      <div className="flex flex-col min-w-0 h-dvh bg-[#F4F5F7] p-6 overflow-hidden">
        <div className="w-full h-dvh grid grid-cols-2 relative z-10 gap-4 ">
          <div className="size-full flex flex-col gap-4">
            <VariantsComponent className="flex-grow" startDistance={-200}>
              <div className="size-full bg-white rounded-2xl shadow">
                <ResultResponse />
              </div>
            </VariantsComponent>
            <VariantsComponent delay={0.5}>
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
            </VariantsComponent>
          </div>
          <div className="size-full flex flex-col gap-4">
            <VariantsComponent
              className="flex-grow"
              startDistance={-200}
              delay={1}
            >
              <div className="size-full bg-white rounded-2xl shadow">
                <PreviewResult />
              </div>
            </VariantsComponent>
            <VariantsComponent className="max-h-60" delay={1.5}>
              <div className="size-full bg-white rounded-2xl shadow">
                <Messages
                  chatId={id}
                  isLoading={isLoading}
                  votes={votes}
                  messages={messages}
                  setMessages={setMessages}
                  reload={reload}
                  isReadonly={isReadonly}
                  isBlockVisible={isBlockVisible}
                />
              </div>
            </VariantsComponent>
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
