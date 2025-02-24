import useSWR from "swr";

export const useGenerateImage = (prompt: string) => {
    const body = {
        image_request: {
            prompt: prompt,
            aspect_ratio: "ASPECT_4_3",
            model: "V_2",
            magic_prompt_option: "AUTO",
        }
    };

    const { data, error, isLoading } = useSWR(prompt ? '/api/generate-image' : null, async (url) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return response.json();
    });

    return {
        data,
        error,
        isLoading,
    };
};