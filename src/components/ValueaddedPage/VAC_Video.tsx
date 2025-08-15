import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { vacTopics } from "../../vacConfig";
import ReactPlayer from "react-player";
import { VideoPlayerState } from "../../types";

export default function VAC_Video() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [allowSeek] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    // Payment check
    if (!localStorage.getItem("vac_payment")) {
      navigate("/value-certificate");
      return;
    }

    const topicId = localStorage.getItem("vac_topic");
    const topic = vacTopics.find((t) => t.id === topicId);

    if (!topic) {
      navigate("/value-certificate/start");
      return;
    }

    if (!topic.videoUrl) {
      // Agar video nahi hai, direct quiz page
      navigate("/value-certificate/quiz");
      return;
    }

    setVideoUrl(topic.videoUrl);
  }, [navigate]);

  const handleProgress = (state: VideoPlayerState) => {
    // Prevent forward seek
    if (!allowSeek && playerRef.current) {
      playerRef.current.seekTo(state.playedSeconds, "seconds");
    }
  };

  const handleEnded = () => {
    navigate("/value-certificate/quiz");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Watch the Video</h2>
      {videoUrl && (
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          controls={true}
          width="100%"
          height="480px"
          onProgress={handleProgress}
          onEnded={handleEnded}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload", // Prevent download
              },
            },
          }}
        />
      )}
    </div>
  );
}
