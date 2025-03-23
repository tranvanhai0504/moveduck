import { Step } from "@/types/step";

export const STEPS: Step[] = [
  {
    step: 1,
    name: "Create Your Quiz!",
    description:
      "Generate a quiz by entering text, a document link, or a Twitter post",
    label: "Create Your Quiz!",
  },
  {
    step: 2,
    name: "Step 2: Preview Your Quiz",
    description:
      "Choose quiz content / Edit Question / Regenerate Quiz with AI",
    label: "Step 2",
  },
  {
    step: 3,
    name: "Step 3: Make your style!",
    description: "Choose an style to make your quiz pop!",
    label: "Step 3",
  },
  {
    step: 4,
    name: "Step 4: Share!",
    description: "Share this quiz to your friends with X.",
    label: "Step 4",
  },
];

export interface TVideoStep extends Step {
  video: string;
}

export const VIDEO_STEP: TVideoStep[] = [
  {
    step: 1,
    name: "How to work ?",
    description: "Let us show you how to make your own quiz!",
    label: "Create Your Quiz!",
    video: "/videos/sample.mp4",
  },
  {
    step: 2,
    name: "Step 1",
    description:
      "Add an option for users to upload an image along with their text/link input.",
    label: "Step 1",
    video: "/videos/step-1.mp4",
  },
  {
    step: 3,
    name: "Step 2",
    description:
      "Modify the quiz generation to incorporate the uploaded image, perhaps as a visual element in the quiz.",
    label: "Step 2",
    video: "/videos/step-2.mp4",
  },
  {
    step: 4,
    name: "Step 3",
    description:
      "Generate a shareable link for the quiz widget, which includes the image if provided.",
    label: "Step 3",
    video: "/videos/step-3.mp4",
  },
];
