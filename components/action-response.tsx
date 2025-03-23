import React, { useEffect, useState } from "react";
import useQuiz from "@/hooks/use-quiz";
import useResultStore from "@/stores/use-result-store";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Link from "next/link";
import useStep from "@/hooks/use-step";
import PreviewResult from "./preview-result";
import { Separator } from "./ui/separator";

const ActionResponse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const { data, setResult } = useResultStore();
  const { createQuiz, getShortLink } = useQuiz();
  const { step } = useStep();

  useEffect(() => {
    if (step !== 4) return;
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
      styleId: data.style?.id ?? 0,
    })
      .then((res) => {
        const urlQuiz = res.data.url
          .toString()
          .replace("undefined/0x", data.style?.id);

        setResult({ ...data, url: urlQuiz });
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [data]);

  useEffect(() => {
    if (!data.url) return;

    getShortLink(data.url).then((res) => {
      setShortLink(res.hashtag);
    });
  }, [data.url]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(data.url as string);
    toast("Copied url to clipboard");
  };

  return (
    <div className="size-full flex justify-center items-center">
      {isLoading ? (
        <Loader2 className=" animate-spin" />
      ) : (
        <div className="grid grid-cols-2 w-full gap-x-4">
          <PreviewResult isFull />

          <div className="flex flex-col space-y-2 size-full mx-auto justify-center">
            <span className="border-2 line-clamp-1 border-black rounded-full p-2 flex justify-between items-center">
              <span className="line-clamp-1">{data.url}</span>
              <button
                className="w-fit rounded-full whitespace-nowrap bg-black hover:bg-black text-white uppercase text-xs !py-1 px-2"
                onClick={handleCopyUrl}
              >
                Copy Link
              </button>
            </span>
            <Button
              className="w-full rounded-full uppercase text-black"
              asChild
            >
              <Link
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                  data.url as string
                )}`}
                target="_blank"
              >
                Share
              </Link>
            </Button>
            {/* <Button
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
            </Button> */}

            <div className="flex items-center justify-center px-4 gap-x-2 my-4">
              <Separator className="w-20" />
              <p>or</p>
              <Separator className="w-20" />
            </div>

            <Button
              className="w-full rounded-full text-black uppercase"
              asChild
              disabled={shortLink === ""}
            >
              <Link
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                  shortLink
                )}`}
                target="_blank"
              >
                Share on X with short Link
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionResponse;
