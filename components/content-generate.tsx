import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { useChat } from "@/hooks/use-chat";
import AnimatedContent from "./animation-content";
import { QuizResult } from "@/types/result";
import { cn } from "@/lib/utils";
import useResultStore from "@/stores/use-result-store";

const ChooseQuiz = ({ quizzes }: { quizzes: QuizResult[] }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizResult | null>(null);
  const { data, setResult } = useResultStore();

  const handleQuizSelect = (quiz: QuizResult) => {
    setSelectedQuiz(quiz);
    setResult({ ...data, quiz: quiz });
  };

  return (
    <div className="w-full grid grid-cols-2 gap-4 mt-4">
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
            Question {index + 1}:{quiz.question}
          </h2>
        </div>
      ))}
    </div>
  );
};

const ContentGenerate = () => {
  // Directly destructure values from the useChat hook
  const { history, isSending } = useChat();

  return (
    <div className="mt-10 flex flex-col gap-y-4">
      {history.map((message) => {
        if (message.role !== "user") {
          return (
            <div key={message.id}>
              <TypeAnimation
                style={{
                  whiteSpace: "pre-line",
                  display: "block",
                }}
                sequence={[message.content]}
                speed={99}
                cursor={false}
              />
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
              className="self-end max-w-[90%]"
              direction="horizontal"
              distance={20}
            >
              <div className="bg-primary text-black w-fit px-4 py-2 rounded-br-none rounded-xl">
                {message.content}
              </div>
            </AnimatedContent>
          );
        }
      })}

      {/* Display the thinking indicator when isSending is true */}
      {isSending && (
        <div className="text-gray-500 animate-pulse">Thinking...</div>
      )}

      <div className="h-10" />
    </div>
  );
};

export default ContentGenerate;
