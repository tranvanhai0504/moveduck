import React, { useEffect, useState } from "react";
import useQuiz from "@/hooks/use-quiz";
import useResultStore from "@/stores/use-result-store";
import { Loader2 } from "lucide-react";
import PreviewResult from "./preview-result";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Link from "next/link";

const ActionResponse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, setResult } = useResultStore();
  const { createQuiz } = useQuiz();

  console.log(data);

  useEffect(() => {
    if (isLoading || data.url) return;
    const quiz = data.quiz;

    if (!quiz) return;
    setIsLoading(true);

    createQuiz({
      question: quiz.question,
      answerA: quiz.answerA,
      answerB: quiz.answerB,
      answerC: quiz.answerC,
      answerD: quiz.answerD,
      correctAnswer: quiz.correctAnswer,
      imageUrl: data.image || "",
    })
      .then((res) => {
        setResult({ ...data, url: res.data.url });
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [data]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(data.url as string);
    toast("Copied url to clipboard");
  };

  return (
    <div className="size-full flex justify-center items-center">
      {isLoading ? (
        <Loader2 className=" animate-spin" />
      ) : (
        <div className="flex flex-col space-y-2 w-3/4 mx-auto h-96 justify-center">
          <Button
            className="w-full rounded-full bg-muted hover:bg-muted text-black uppercase"
            onClick={handleCopyUrl}
          >
            Copy Link
          </Button>
          <Button className="w-full rounded-full uppercase text-black">
            Share
          </Button>
          <Button
            className="w-full rounded-full bg-muted hover:bg-muted text-black uppercase"
            asChild
          >
            <Link
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                data.url as string
              )}`}
              target="_blank"
            >
              Share on X
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActionResponse;
