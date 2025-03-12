const url = process.env.NEXT_PUBLIC_BACKEND_URL;

const useQuiz = () => {
  // Create a new quiz
  const createQuiz = async (quizData: {
    question: string;
    answerA: string;
    answerB: string;
    answerC: string;
    answerD: string;
    correctAnswer: string;
    imageUrl: string;
  }) => {
    try {
      const response = await fetch(`${url}/api/v1/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });
      return await response.json();
    } catch (error) {
      throw new Error("Failed to create quiz");
    }
  };

  // Submit an answer for validation
  const submitAnswer = async (quizId: string, selectedAnswer: string) => {
    try {
      const response = await fetch(
        `${url}/api/v1/quiz/validate/${quizId}?select=${selectedAnswer}`,
        {
          method: "POST",
        }
      );
      return await response.json();
    } catch (error) {
      throw new Error("Failed to submit answer");
    }
  };

  // Get quiz by ID with optional styling parameters
  const getQuiz = async (
    id: string,
    styling?: {
      buttonBg?: string;
      bgColor?: string;
      textColor?: string;
    }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        id,
        ...(styling?.buttonBg && { buttonBg: styling.buttonBg }),
        ...(styling?.bgColor && { bgColor: styling.bgColor }),
        ...(styling?.textColor && { textColor: styling.textColor }),
      });

      const response = await fetch(`${url}/api/v1/quiz?${queryParams}`);
      return await response.json();
    } catch (error) {
      throw new Error("Failed to fetch quiz");
    }
  };

  // Get quiz details by IPFS hash
  const getQuizByHash = async (hash: string) => {
    try {
      const response = await fetch(`${url}/api/v1/quiz/${hash}`);
      return await response.json();
    } catch (error) {
      throw new Error("Failed to fetch quiz by hash");
    }
  };

  return {
    createQuiz,
    submitAnswer,
    getQuiz,
    getQuizByHash,
  };
};

export default useQuiz;
