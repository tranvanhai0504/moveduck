import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { useChat } from "@/hooks/use-chat";
import AnimatedContent from "./animation-content";
import { QuizResult } from "@/types/result";
import { cn } from "@/lib/utils";
import useResultStore from "@/stores/use-result-store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import useStep from "@/hooks/use-step";

const ChooseQuiz = ({ quizzes }: { quizzes: QuizResult[] }) => {
  const { data, setResult } = useResultStore();
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResult | undefined>(
    data.quiz
  );
  const { nextStep } = useStep();

  const handleQuizSelect = (quiz: QuizResult) => {
    setSelectedQuiz(quiz);
    setResult({ ...data, quiz: quiz });
  };

  return (
    <div className="w-full grid grid-cols-2 gap-4 mt-4 px-10">
      <h1 className="col-span-2 font-semibold">Selected your quiz</h1>
      {quizzes.map((quiz, index) => (
        <div
          key={index}
          className={cn(
            "bg-white rounded-xl p-4 shadow-md cursor-pointer hover:shadow-lg transition duration-300 h-full",
            selectedQuiz === quiz && "bg-primary"
          )}
          onClick={() => handleQuizSelect(quiz)}
        >
          <h2 className="text-sm mb-2">
            Question {index + 1}: {quiz.question}
          </h2>
        </div>
      ))}
      <Button
        disabled={!selectedQuiz}
        className="col-span-2 rounded-2xl text-black"
        onClick={nextStep}
      >
        Confirm
      </Button>
    </div>
  );
};

const ContentGenerate = () => {
  const { history, isSending } = useChat();

  return (
    <div className="flex flex-col gap-y-4 bg-white px-4 py-8 rounded-3xl">
      {history.map((message) => {
        if (message.role !== "user") {
          return (
            <div key={message.id}>
              <AnimatedContent
                key={message.id}
                config={{ friction: 5 }}
                className="max-w-[90%] flex flex-row gap-x-4"
                direction="horizontal"
                distance={20}
              >
                <Avatar>
                  <AvatarImage
                    sizes="sm"
                    src="/images/duck-avatar.svg"
                    alt="@duck"
                  />
                </Avatar>
                <span className="rounded-full w-fit self-end flex h-full items-center">
                  <TypeAnimation
                    style={{
                      whiteSpace: "pre-line",
                      display: "block",
                    }}
                    sequence={[message.content]}
                    speed={99}
                    cursor={false}
                    className="text-sm"
                  />
                </span>
              </AnimatedContent>

              {message.action === "QUIZ_GEN" && message.params && (
                <ChooseQuiz quizzes={message.params?.questions} />
              )}
            </div>
          );
        } else {
          return (
            <AnimatedContent
              key={message.id}
              config={{ friction: 5 }}
              className="self-end max-w-[90%] flex flex-row gap-x-4"
              direction="horizontal"
              distance={20}
            >
              <span className="rounded-full w-fit self-end flex h-full items-center">
                {message.content}
              </span>
              <Avatar>
                <AvatarImage
                  sizes="sm"
                  src="/images/user-avatar.png"
                  alt="@you"
                />
              </Avatar>
            </AnimatedContent>
          );
        }
      })}

      {/* Display the thinking indicator when isSending is true */}
      {isSending && (
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage
              sizes="sm"
              src="/images/duck-avatar.svg"
              alt="@shadcn"
            />
          </Avatar>
          <span className="rounded-full w-fit max-w-96 self-end text-sm flex h-full items-center">
            Thinking...
          </span>
        </div>
      )}
    </div>
  );
};

export default ContentGenerate;
