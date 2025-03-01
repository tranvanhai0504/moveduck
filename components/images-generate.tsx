import { useGenerateImage } from "@/hooks/use-generate-image";
import useResultStore from "@/stores/use-result-store";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";

const ImageGenerator = () => {
  const { data, setResult } = useResultStore();
  const [imageResponse, setImageResponse] = useState([
    "https://plum-active-landfowl-217.mypinata.cloud/ipfs/bafybeiacddi327dpifgehjhinzql7u5dmpoq2lvvbeqjkjaguxy5e6feva",
    "https://plum-active-landfowl-217.mypinata.cloud/ipfs/bafkreicspk4vjdydxns5jdpfseaablcvc7soy6xxewar5iotrlntxxssyu",
    "https://plum-active-landfowl-217.mypinata.cloud/ipfs/bafkreidhesv3fdzwdj526y23hznxwsqqabdcwr3t4p7a5josgieudwqute",
  ]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    imageResponse.findIndex((url) => url === data.image)
  );

  // const {
  //   data: imageResponse,
  //   isLoading,
  //   generateImage,
  // } = useGenerateImage(
  //   "A serene tropical beach scene. Dominating the foreground are tall palm trees with lush green leaves, standing tall against a backdrop of a sandy beach. The beach leads to the azure waters of the sea, which gently kisses the shoreline. In the distance, there is an island or landmass with a silhouette of what appears to be a lighthouse or tower. The sky above is painted with fluffy white clouds, some of which are tinged with hues of pink and orange, suggesting either a sunrise or sunset."
  // );

  // useEffect(() => {
  //   if (isLoading) return;
  //   if (imageResponse) return;

  //   generateImage()?.then();
  // }, [generateImage, imageResponse, isLoading]);

  // if (false)
  //   return (
  //     <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px] flex-grow w-2/3 mx-auto mt-10">
  //       <Skeleton className="size-full" />
  //       <Skeleton className="size-full" />
  //       <Skeleton className="size-full" />
  //       <Skeleton className="size-full" />
  //     </div>
  //   );

  const handleImageSelect = (imageUrl: string, index: number) => {
    setSelectedImageIndex(index);
    setResult({ ...data, image: imageUrl });
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-fit flex-grow w-2/3 mx-auto mt-10">
      {imageResponse.map((item, index) => (
        <div
          key={index}
          className={`size-full aspect-square rounded-xl relative cursor-pointer border-4 ${
            selectedImageIndex === index
              ? "border-primary shadow-lg"
              : "border-transparent"
          }`}
          onClick={() => handleImageSelect(item, index)}
        >
          <Image src={item} alt="image" fill className="z-20 rounded-lg" />
        </div>
      ))}
      {Array.from({ length: 4 - imageResponse.length }).map((_, index) => (
        <Skeleton key={index} className="size-full aspect-square" />
      ))}
    </div>
  );
};

export default ImageGenerator;
