import useResultStore from "@/stores/use-result-store";
import useStep from "@/hooks/use-step";
import { Skeleton } from "./ui/skeleton";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function PreviewResult() {
  const { data } = useResultStore();
  const { step } = useStep();

  return (
    <div className="preview-result px-6 pt-6 size-full flex flex-col">
      <h1 className="text-xl font-semibold text-muted-foreground">Preview</h1>
      <div
        className={cn(
          "size-full overflow-y-scroll hidden-scroll items-center justify-center flex"
        )}
      >
        {data.title ? (
          <div
            className="mx-auto w-3/4 2xl:w-3/5 rounded-2xl border p-6 flex flex-col space-y-4"
            style={{
              color: data.color?.textColor,
              backgroundColor: data.color?.backgroundColor,
            }}
          >
            <AspectRatio ratio={320 / 265}>
              {data.image ? (
                <Image
                  src={data.image}
                  alt={data.title}
                  className="rounded-2xl object-cover object-center"
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
              {data.description ? (
                <p className="text-muted-foreground text-sm">
                  {data.description}
                </p>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </div>
            <div>
              {data.color ? (
                <p className="text-muted-foreground text-sm">
                  {data.description}
                </p>
              ) : (
                <Skeleton className="w-full h-10" />
              )}
            </div>
          </div>
        ) : (
          <Skeleton className="mx-auto w-3/4 2xl:w-2/4 rounded-2xl flex-grow my-6" />
        )}
      </div>
    </div>
  );
}
