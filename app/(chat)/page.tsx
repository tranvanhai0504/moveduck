import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AnimateCard = ({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "w-full border rounded-2xl p-4 group flex flex-col bg-white shadow-sm",
        className
      )}
    >
      <div className="mb-4 group-hover:translate-x-4 transition-transform flex flex-col justify-center">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
};

export default async function Page() {
  return (
    <div className="py-10 flex flex-col items-center justify-center size-full m-auto gap-y-4">
      <h1 className="text-3xl font-semibold">Simplified Understanding!</h1>
      <p>You can see full documentation in our docs</p>
      <div className="grid grid-cols-2 gap-4 w-full mt-10">
        <AnimateCard
          title="Introduction AgentKit"
          description="Powerful agent to manage autonomous AI agents."
        >
          <div className="size-full rounded-xl bg-primary overflow-hidden relative">
            <Image
              src="/images/bound.png"
              alt="img"
              fill
              className="object-cover"
            />
          </div>
        </AnimateCard>
        <AnimateCard
          title="Learn Aptos through fun quizzes and memes"
          description="Simply enter your link or text in the chat to start your interactive journey"
        >
          <div className="size-full flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2 self-end">
              <span className="rounded-full w-fit self-end text-xs flex h-full items-center">
                Generate for me a quiz!
              </span>
              <Avatar>
                <AvatarImage
                  sizes="sm"
                  src="/images/user-avatar.png"
                  alt="@shadcn"
                />
              </Avatar>
            </div>
            <div className="flex items-center gap-x-2">
              <Avatar>
                <AvatarImage
                  sizes="sm"
                  src="/images/duck-avatar.svg"
                  alt="@shadcn"
                />
              </Avatar>
              <span className="rounded-full w-fit max-w-96 self-end text-xs flex h-full items-center">
                Great choice! I&apos;m generating a quiz tailored to your
                profile. Based on your answers, this quiz will focus on [topic].
                Let&apos;s get started!
              </span>
            </div>
            <div className="relative w-full flex flex-col gap-4 mt-4">
              <Input
                placeholder="What is Block-STM? Generate a quiz"
                className={cn(
                  "min-h-[24px] max-h-[calc(14dvh)] overflow-hidden resize-none py-8 px-4 !pe-14 rounded-2xl !text-sm border"
                )}
                autoFocus
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2 p-2 w-fit flex flex-row justify-end">
                <Button className="rounded-full p-1.5 h-fit border dark:border-zinc-600">
                  <MoveRight size={14} className="!text-black" />
                </Button>
              </div>
            </div>
          </div>
        </AnimateCard>
        <div className="col-span-2 grid grid-cols-3 gap-x-4">
          <AnimateCard
            title="Sequential task linking"
            description="Linking multiple tasks in a project flow."
          />
          <AnimateCard
            title="Enhanced input options"
            description="User interaction capabilities."
          />
          <AnimateCard
            title="Secure data signing"
            description="Focus on the security aspect of message authentication."
          />
        </div>
        <div className="col-span-2 flex justify-center">
          <Button
            asChild
            className="px-32 rounded-xl bg-[#2D2D2D] hover:bg-black text-white"
          >
            <Link href={"/generate"}>Start</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
