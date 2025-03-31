import React, { RefObject } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../../store/eventsSaga";
import VideoOverlay from "./VideoOverlay";
import Player from "video.js/dist/types/player";

interface Event {
  timestamp: number;
  duration: number;
  zone: { left: number; top: number; width: number; height: number };
}

const createTestStore = (initialState: any) => {
  return configureStore({
    reducer: { events: eventsReducer },
    preloadedState: { events: initialState },
  });
};

describe("VideoOverlay Component", () => {
  let overlayRef: RefObject<HTMLDivElement | null> | null;
  let playerMock: { on: jest.Mock; currentTime: jest.Mock } & Partial<Player>;

  beforeEach(() => {
    overlayRef = React.createRef();
    playerMock = {
      on: jest.fn(),
      currentTime: jest.fn().mockReturnValue(10),
    };
  });

  test("renders without crashing", () => {
    const store = createTestStore({ loading: false, events: [], error: null });
    render(
      <Provider store={store}>
        <VideoOverlay
          overlayRef={overlayRef}
          videoSize={{ width: 640, height: 360 }}
          player={playerMock as any}
        />
      </Provider>
    );
    expect(screen.getByTestId("video-overlay-container")).toBeInTheDocument();
  });

  test("renders overlay when event is active", async () => {
    const mockEvents: Event[] = [
      {
        timestamp: 5,
        duration: 10,
        zone: { left: 100, top: 50, width: 200, height: 100 },
      },
    ];

    const store = createTestStore({
      loading: false,
      events: mockEvents,
      error: null,
    });

    playerMock.currentTime = jest.fn().mockReturnValue(7);

    playerMock.on.mockImplementationOnce(
      (event: string, callback: Function) => {
        if (event === "timeupdate") {
          callback();
        }
      }
    );

    render(
      <Provider store={store}>
        <VideoOverlay
          overlayRef={overlayRef}
          videoSize={{ width: 640, height: 360 }}
          player={playerMock as any}
        />
      </Provider>
    );

    await waitFor(() => screen.getByTestId("event-overlay"));

    expect(screen.getByTestId("event-overlay")).toBeInTheDocument();
  });

  test("does not render overlay if no active events", () => {
    const mockEvents: Event[] = [
      {
        timestamp: 20,
        duration: 5,
        zone: { left: 100, top: 50, width: 200, height: 100 },
      },
    ];
    const store = createTestStore({
      loading: false,
      events: mockEvents,
      error: null,
    });
    render(
      <Provider store={store}>
        <VideoOverlay
          overlayRef={overlayRef}
          videoSize={{ width: 640, height: 360 }}
          player={playerMock as any}
        />
      </Provider>
    );
    expect(screen.queryByTestId("event-overlay")).not.toBeInTheDocument();
  });
});
