import { useGenerateImage } from "@/hooks/use-generate-image"
import useResultStore from "@/stores/use-result-store"
import Image from "next/image"
import { Skeleton } from "./ui/skeleton"
import { useEffect } from "react"
import { set } from "date-fns"

const ImageGenerator = () => {
    const { data, setResult } = useResultStore()
    // const { data: imageResponse, isLoading } = useGenerateImage("A serene tropical beach scene. Dominating the foreground are tall palm trees with lush green leaves, standing tall against a backdrop of a sandy beach. The beach leads to the azure waters of the sea, which gently kisses the shoreline. In the distance, there is an island or landmass with a silhouette of what appears to be a lighthouse or tower. The sky above is painted with fluffy white clouds, some of which are tinged with hues of pink and orange, suggesting either a sunrise or sunset.")

    // useEffect(() => {
    //     if (imageResponse) {
    //         setResult({
    //             ...data,
    //             image: imageResponse.data[0].url
    //         })
    //     }
    // }, [data])

    // console.log(imageResponse)
    // if (isLoading) return <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px] flex-grow w-full mt-10">
    //     <Skeleton className="size-full" />
    //     <Skeleton className="size-full" />
    //     <Skeleton className="size-full" />
    //     <Skeleton className="size-full" />
    // </div>

    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px] flex-grow w-full mt-10">
            <div className="size-full rounded relative">
                {/* <Image src={imageResponse.data[0].url} alt="image" fill className="z-20 rounded-lg" /> */}
            </div>
            <Skeleton className="size-full" />
            <Skeleton className="size-full" />
            <Skeleton className="size-full" />
        </div>
    )
}

export default ImageGenerator