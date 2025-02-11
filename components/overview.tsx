import { motion } from "framer-motion";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import GradientText from "./gradient-text";

export const Overview = () => {
  const { authenticated } = usePrivy();

  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      {!authenticated ? (
        <div className="w-full flex flex-col items-center space-y-4">
          {/* <Image src={"/images/hand.png"} alt="hand" width={100} height={100} /> */}
          <GradientText
            className="text-2xl !font-bold text-center !cursor-default"
            colors={["#b0c4de", "#c0c0c0", "#d3d3d3", "#a9a9a9", "#808080"]}
            animationSpeed={4}
          >
            Oh nu, you need connect wallet to continue.
          </GradientText>
          <p className="text-muted-foreground">Connect wallet to explore</p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center space-y-4">
          {/* <Image src={"/images/hand.png"} alt="hand" width={100} height={100} /> */}
          <GradientText
            className="text-2xl !font-bold text-center"
            colors={["#b0c4de", "#c0c0c0", "#d3d3d3", "#a9a9a9", "#808080"]}
            animationSpeed={4}
          >
            Hi there!.
          </GradientText>
          <p className="text-muted-foreground">How can I help you today?</p>
        </div>
      )}
      {/* <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <VercelIcon size={32} />
          <span>+</span>
          <MessageIcon size={32} />
        </p>
        <p>
          This is an{" "}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://github.com/vercel/ai-chatbot"
            target="_blank"
          >
            open source
          </Link>{" "}
          chatbot template built with Next.js and the AI SDK by Vercel. It uses
          the{" "}
          <code className="rounded-md bg-muted px-1 py-0.5">streamText</code>{" "}
          function in the server and the{" "}
          <code className="rounded-md bg-muted px-1 py-0.5">useChat</code> hook
          on the client to create a seamless chat experience.
        </p>
        <p>
          You can learn more about the AI SDK by visiting the{" "}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://sdk.vercel.ai/docs"
            target="_blank"
          >
            docs
          </Link>
          .
        </p>
      </div> */}
    </motion.div>
  );
};
