import useResultStore from "@/stores/use-result-store";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import useImagesStore from "@/stores/use-images-store";
import { AspectRatio } from "./ui/aspect-ratio";

const prompt =
  "An animated character, resembling a yellow duck, wearing glasses and a white lab coat. The character stands in front of a large whiteboard or something can show that reads 'topic'. The background in any place, like office, classroom, beach, on moon, on planet, etc, making it the focal point of the image.";

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
      if (images.length > 0) return;

      setIsLoading(true);
      try {
        const body = {
          image_request: {
            prompt: prompt.replace("topic", data.quiz?.question ?? ""),
            aspect_ratio: "ASPECT_4_3",
            model: "V_2_TURBO",
            magic_prompt_option: "AUTO",
            num_images: 1,
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
        <AspectRatio
          key={index}
          className={`size-full rounded-xl relative cursor-pointer border-4 ${
            selectedImageIndex === index
              ? "border-primary shadow-lg"
              : "border-transparent"
          }`}
          onClick={() => handleImageSelect(item, index)}
          ratio={4 / 3}
        >
          <Image
            src={item}
            alt="image"
            fill
            className="z-20 rounded-lg object-contain"
          />
        </AspectRatio>
      ))}
      {Array.from({ length: 4 - images.length }).map((_, index) => (
        <Skeleton key={index} className="size-full aspect-square" />
      ))}
    </div>
  );
};

export default ImageGenerator;
