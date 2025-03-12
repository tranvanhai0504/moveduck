import useResultStore from "@/stores/use-result-store";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import useImagesStore from "@/stores/use-images-store";

const prompt =
  "An animated character, resembling a yellow duck, wearing glasses and a white lab coat. The character stands in front of a large whiteboard that reads 'topic'. The background appears to be a room with a window, and there's a logo of 'Movement' at the bottom right corner of the image replace A stylized blue fish, predominantly in shades of blue and white. The fish appears to be in mid-jump or leap, with its body curved upwards and its tail trailing behind. The background is a light blue grid pattern, and the fish is positioned centrally, making it the focal point of the image.";

type ImageGen = {
  prompt: string;
  resolution: string;
  is_image_safe: boolean;
  seed: number;
  url: string;
};

const ImageGenerator = () => {
  const { data, setResult } = useResultStore();
  const { images, addImage } = useImagesStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    images.findIndex((url) => url === data.image)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [imagesGen, setImagesGen] = useState<{ data: ImageGen[] } | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!prompt) return;
      if (isLoading) return;

      setIsLoading(true);
      try {
        const body = {
          image_request: {
            prompt: prompt.replace("topic", data.quiz?.question ?? ""),
            aspect_ratio: "ASPECT_4_3",
            model: "V_2_TURBO",
            magic_prompt_option: "AUTO",
            num_images: 4,
          },
        };

        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const result = await response.json();
        setImagesGen(result);
      } catch (error) {
        console.error("Error generating images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [data.quiz?.question]);

  useEffect(() => {
    if (isLoading) return;
    if (!imagesGen) return;

    imagesGen.data.map((image) => {
      addImage(image.url);
    });
  }, [imagesGen, isLoading, addImage]);

  if (isLoading)
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-4  aspect-square flex-grow w-2/3 mx-auto mt-10">
        <Skeleton className="size-full" />
        <Skeleton className="size-full" />
        <Skeleton className="size-full" />
        <Skeleton className="size-full" />
      </div>
    );

  const handleImageSelect = (imageUrl: string, index: number) => {
    setSelectedImageIndex(index);
    setResult({ ...data, image: imageUrl });
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-fit flex-grow w-2/3 mx-auto mt-4">
      {images.map((item, index) => (
        <div
          key={index}
          className={`size-full aspect-square rounded-xl relative cursor-pointer border-4 ${
            selectedImageIndex === index
              ? "border-primary shadow-lg"
              : "border-transparent"
          }`}
          onClick={() => handleImageSelect(item, index)}
        >
          <Image
            src={item}
            alt="image"
            fill
            className="z-20 rounded-lg object-contain"
          />
        </div>
      ))}
      {Array.from({ length: 4 - images.length }).map((_, index) => (
        <Skeleton key={index} className="size-full aspect-square" />
      ))}
    </div>
  );
};

export default ImageGenerator;
