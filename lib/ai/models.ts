// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
  disabled: boolean;
}

export const models: Array<Model> = [
  {
    id: "gpt-4o-mini",
    label: "GPT 4o mini",
    apiIdentifier: "gpt-4o-mini",
    description: "Small model for fast, lightweight tasks",
    disabled: false,
  },
  {
    id: "gpt-4o",
    label: "GPT 4o",
    apiIdentifier: "gpt-4o",
    description: "For complex, multi-step tasks",
    disabled: true,
  },
  {
    id: "Claude-3.5-sonnnet",
    label: "Claude 3.5 sonnnet",
    apiIdentifier: "",
    description: "Coming soon",
    disabled: true,
  },
  {
    id: "Gemini",
    label: "Gemini",
    apiIdentifier: "",
    description: "Coming soon",
    disabled: true,
  },
  {
    id: "DeepSeek",
    label: "DeepSeek",
    apiIdentifier: "",
    description: "Coming soon",
    disabled: true,
  },
] as const;

export const DEFAULT_MODEL_NAME: string = "gpt-4o-mini";
