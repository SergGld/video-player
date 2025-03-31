import React, { useRef, useState, useEffect, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { fetchEvents } from "../../store/eventsSaga";
import EventsList from "../EventList/EventsList";
import VideoOverlay from "../VideoOverlay/VideoOverlay";
import { videoURL } from "../../config/consts";
import Player from "video.js/dist/types/player";

const VideoContainer = styled.div`
  grid-column-gap: 10px;
  display: flex;
  position: relative;
  width: 100%;
  max-width: 1500px;
  height: 100%;
`;
const VideoElement = styled.video`
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  height: 100%;
  width: 100%;
  cursor: pointer;
  margin-top: 20px;
`;
const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [videoSize, setVideoSize] = useState({ width: 1, height: 1 });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const updateSizes = useCallback(() => {
    const playerNode = playerRef.current;

    if (playerNode) {
      setVideoSize({
        width: playerNode.videoWidth(),
        height: playerNode.videoHeight(),
      });
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      responsive: true,
      fluid: true,
      sources: [
        {
          src: videoURL,
          type: "video/mp4",
        },
      ],
    });

    const player = playerRef.current;

    player.ready(() => {
      updateSizes();
    });

    player.on("loadedmetadata", updateSizes);

    window.addEventListener("resize", updateSizes);

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      window.removeEventListener("resize", updateSizes);
    };
  }, [updateSizes]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      // В фулскрин видео нужно перемонтирование оверлея, иначе он не будет виден
      const isFull = document.fullscreenElement !== null;

      const videoContainer = videoRef.current?.parentNode as HTMLElement;
      const overlay = overlayRef.current;

      if (overlay && videoContainer) {
        if (isFull) {
          videoContainer.appendChild(overlay); // Вставляем в фуллскрин
        } else {
          //Возвращаем обратно
          videoRef?.current?.parentNode?.insertBefore(
            overlay,
            videoRef?.current?.nextSibling
          );
        }
      }

      updateSizes();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [updateSizes]);

  const handleEventClick = (timestamp: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime(timestamp);
      playerRef.current.play();
    }
  };

  return (
    <VideoContainer>
      <VideoElement
        ref={videoRef}
        className="video-js vjs-default-skin vjs-big-play-centered"
      />

      <VideoOverlay
        overlayRef={overlayRef}
        videoSize={videoSize}
        player={playerRef.current}
      />
      <EventsList
        height={videoRef.current?.offsetHeight}
        handleEventClick={handleEventClick}
      />
    </VideoContainer>
  );
};
export default VideoPlayer;
