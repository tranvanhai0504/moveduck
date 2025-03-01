import useSWRMutation from "swr/mutation";

export const useGenerateImage = (prompt: string) => {
  const body = {
    image_request: {
      prompt: prompt,
      aspect_ratio: "ASPECT_4_3",
      model: "V_2",
      magic_prompt_option: "AUTO",
    },
  };

  async function sendRequest(url: string, { arg }: { arg: typeof body }) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    });
    return response.json();
  }

  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/generate-image",
    sendRequest
  );

  return {
    generateImage: () => prompt ? trigger(body) : null,
    data,
    error,
    isLoading: isMutating,
  };
};
