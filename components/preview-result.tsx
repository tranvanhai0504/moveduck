import useResultStore from "@/stores/use-result-store";
import { Skeleton } from "./ui/skeleton";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function PreviewResult() {
  const { data } = useResultStore();

  return (
    <div className="preview-result px-6 pt-6 size-full flex flex-col justify-center">
      <div className={cn(" flex py-5")}>
        {data.quiz ? (
          <div
            className="mx-auto w-5/6 h-fit rounded-2xl border p-6 flex flex-col space-y-4"
            style={{
              color: data.color?.textColor,
              backgroundColor: data.color?.backgroundColor,
            }}
          >
            <AspectRatio ratio={320 / 200}>
              {data.image ? (
                <Image
                  src={data.image}
                  alt={data.title}
                  className="rounded-xl object-cover object-center"
                  fill
                />
              ) : (
                <Skeleton className="rounded-2xl size-full" />
              )}
            </AspectRatio>
            <div className="flex flex-col space-y-2">
              <h1 className=" font-medium text-2xl line-clamp-2">
                {data.title}
              </h1>
              {data.quiz ? (
                <div className="text-sm">
                  <p>{data.quiz.question}</p>
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <span
                      className="w-full py-2 rounded-full text-center bg-primary"
                      style={{
                        backgroundColor: data.color?.buttonBackgroundColor,
                      }}
                    >
                      {data.quiz.answerA}
                    </span>
                    <span
                      className="w-full py-2 rounded-full text-center bg-primary"
                      style={{
                        backgroundColor: data.color?.buttonBackgroundColor,
                      }}
                    >
                      {data.quiz.answerB}
                    </span>
                    <span
                      className="w-full py-2 rounded-full text-center bg-primary"
                      style={{
                        backgroundColor: data.color?.buttonBackgroundColor,
                      }}
                    >
                      {data.quiz.answerC}
                    </span>
                    <span
                      className="w-full py-2 rounded-full text-center bg-primary"
                      style={{
                        backgroundColor: data.color?.buttonBackgroundColor,
                      }}
                    >
                      {data.quiz.answerD}
                    </span>
                  </div>
                </div>
              ) : (
                <Skeleton className="w-full h-32" />
              )}
            </div>
          </div>
        ) : (
          <Skeleton className="mx-auto w-3/4 2xl:w-4/6 rounded-2xl my-6" />
        )}
      </div>
    </div>
  );
}
