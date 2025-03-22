import useResultStore from "@/stores/use-result-store";
import { Skeleton } from "./ui/skeleton";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function PreviewResult({
  isFull = false,
}: {
  isFull?: boolean;
}) {
  const { data } = useResultStore();

  return (
    <div className={cn(" flex py-5")}>
      {data.quiz ? (
        <div
          className={cn(
            "mx-auto h-fit rounded-2xl flex flex-col relative",
            isFull ? "w-full" : " w-5/6"
          )}
          style={{ background: data.style?.backgroundColor }}
        >
          <AspectRatio ratio={320 / 200}></AspectRatio>
          {data.image ? (
            <div
              className="w-full h-1/2 absolute top-0 left-0"
              style={{
                height:
                  data.style?.imageObjectStyle === "cover" ? "100%" : "50%",
              }}
            >
              <Image
                src={data.image}
                alt={data.title}
                className="object-contain object-center z-10 relative rounded-2xl"
                fill
                style={{ objectFit: data.style?.imageObjectStyle }}
              />
            </div>
          ) : (
            <Skeleton className="rounded-2xl size-full" />
          )}
          <div
            className="flex flex-col space-y-2 p-4 z-20 relative"
            style={{
              backgroundColor: data.style?.containerStyle.backgroundColor,
              border: data.style?.containerStyle.border,
              borderRadius: data.style?.containerStyle.borderRadius,
            }}
          >
            <h1
              className=" font-medium text-2xl line-clamp-2"
              style={{ color: data.style?.titleTextColor }}
            >
              {data.title}
            </h1>
            {data.quiz ? (
              <div className="text-sm">
                <p style={{ color: data.style?.descriptionTextColor }}>
                  {data.quiz.question}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <span
                    className="w-full py-2 rounded-full text-center border border-transparent"
                    style={{
                      backgroundColor:
                        data.style?.buttonsStyle.buttonOne.backgroundColor,
                      color: data.style?.buttonsStyle.buttonOne.textColor,
                      borderRadius:
                        data.style?.buttonsStyle.buttonOne.borderRadius,
                      borderColor:
                        data.style?.buttonsStyle.buttonOne.borderColor,
                    }}
                  >
                    {data.quiz.answerA}
                  </span>
                  <span
                    className="w-full py-2 rounded-full text-center border border-transparent"
                    style={{
                      backgroundColor:
                        data.style?.buttonsStyle.buttonTwo.backgroundColor,
                      color: data.style?.buttonsStyle.buttonTwo.textColor,
                      borderRadius:
                        data.style?.buttonsStyle.buttonTwo.borderRadius,
                      borderColor:
                        data.style?.buttonsStyle.buttonTwo.borderColor,
                    }}
                  >
                    {data.quiz.answerB}
                  </span>
                  <span
                    className="w-full py-2 rounded-full text-center border border-transparent"
                    style={{
                      backgroundColor:
                        data.style?.buttonsStyle.buttonThree.backgroundColor,
                      color: data.style?.buttonsStyle.buttonThree.textColor,
                      borderRadius:
                        data.style?.buttonsStyle.buttonThree.borderRadius,
                      borderColor:
                        data.style?.buttonsStyle.buttonThree.borderColor,
                    }}
                  >
                    {data.quiz.answerC}
                  </span>
                  <span
                    className="w-full py-2 rounded-full text-center border border-transparent"
                    style={{
                      backgroundColor:
                        data.style?.buttonsStyle.buttonFour.backgroundColor,
                      color: data.style?.buttonsStyle.buttonFour.textColor,
                      borderRadius:
                        data.style?.buttonsStyle.buttonFour.borderRadius,
                      borderColor:
                        data.style?.buttonsStyle.buttonFour.borderColor,
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
        <Skeleton
          className={cn(
            "mx-auto rounded-2xl my-6 h-96",
            isFull ? "w-full" : "w-3/4 2xl:w-4/6"
          )}
        />
      )}
    </div>
  );
}
