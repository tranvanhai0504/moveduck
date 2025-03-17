import React, { useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const VideoPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="px-8 pt-8 pb-4">
      <div
        style={{ boxShadow: "0px 0px 31px 6px rgba(244, 166, 37, 0.72)" }}
        className="rounded-xl overflow-hidden border-2 border-[#F4A625] relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <video ref={videoRef} className="w-full">
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button
          onClick={togglePlay}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-4 text-white hover:bg-opacity-75 transition-all ${
            isPlaying && !isHovering ? "opacity-0" : "opacity-100"
          }`}
        >
          {isPlaying ? (
            <FaPause className="text-4xl" />
          ) : (
            <FaPlay className="text-4xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
