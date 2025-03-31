import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Player from "video.js/dist/types/player";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const EventOverlay = styled.div`
  position: absolute;
  border: 2px solid green;
  background: rgba(0, 255, 0, 0.3);
`;

interface VideoOverlayProps {
  overlayRef: any;
  videoSize: {
    width: number;
    height: number;
  };
  player: Player | null;
}
const VideoOverlay: React.FC<VideoOverlayProps> = ({
  overlayRef,
  videoSize,
  player,
}) => {
  const { events } = useSelector((state: RootState) => state.events) ?? {};

  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (player) {
      player.on("timeupdate", () => setCurrentTime(player.currentTime() ?? 0));
    }
  }, [player]);

  // Функция для расчета позиции элемента с видео
  const calculateOverlayPosition = () => {
    const trackElement = document.querySelector(".vjs-text-track-display");
    if (trackElement) {
      const rect = trackElement.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      };
    }
    return { width: 0, height: 0, top: 0, left: 0 };
  };

  const activeEvents =
    events?.filter(
      (event) =>
        currentTime >= event.timestamp &&
        currentTime <= event.timestamp + event.duration
    ) ?? [];

  return (
    <div ref={overlayRef} data-testid="video-overlay-container">
      {activeEvents.map((event, index) => {
        const { width, height, top, left } = calculateOverlayPosition();
        const scaleX = width / videoSize.width;
        const scaleY = height / videoSize.height;

        console.log(`Event: ${event.timestamp}, Current Time: ${currentTime}`);
        console.log(
          `Overlay Position: left=${left + event.zone.left * scaleX}, top=${
            top + event.zone.top * scaleY
          }`
        );

        return (
          <EventOverlay
            data-testid="event-overlay"
            key={index}
            style={{
              left: left + event.zone.left * scaleX,
              top: top + event.zone.top * scaleY,
              width: event.zone.width * scaleX,
              height: event.zone.height * scaleY,
            }}
          />
        );
      })}
    </div>
  );
};

export default VideoOverlay;
