import React from "react";
import AnimatedContent from "./animation-content";
import { TypeAnimation } from "react-type-animation";

const sampleContent = `Let's create a quiz to help you test your understanding of the Move package analogy you've provided. Here's a set of questions based on your explanation:\n\n1. What does the Move package represent in the cake baking analogy?\n2. How are Move Source Code Files (.move) similar to steps in a recipe book?\n3. What role does the Move Configuration file (.toml) play in the analogy?\n4. Why is a Test Directory important in ensuring code reliability?\n\nFeel free to answer these questions to test your understanding, and if you need further clarification or additional questions, just let me know!`;

const ContentGenerate = () => {
  const splitContent = sampleContent.split("\n");
  return (
    <div className="mt-10">
      {/* {splitContent.map((line, index) => (
        <>
          {line}
          <br />
        </>
      ))} */}
      <TypeAnimation
        style={{ whiteSpace: "pre-line", height: "195px", display: "block" }}
        sequence={[
          sampleContent, // actual line-break inside string literal also gets animated in new line, but ensure there are no leading spaces
        ]}
        speed={99}
      />
    </div>
  );
};

export default ContentGenerate;
