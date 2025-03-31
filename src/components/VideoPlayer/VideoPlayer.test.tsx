import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import VideoPlayer from "./VideoPlayer";
import eventsReducer from "../../store/eventsSaga";

const createTestStore = (initialState: any) => {
  return configureStore({
    reducer: { events: eventsReducer },
    preloadedState: { events: initialState },
  });
};

describe("VideoPlayer Component", () => {
  const mockEvents = [
    {
      timestamp: 6.160356073346696,
      duration: 0.8361136523432808,
      zone: {
        left: 113.299598661696,
        top: 195.3639952425215,
        width: 126.18979937751924,
        height: 46.23090211142281,
      },
    },
  ];

  test("renders video player and overlay", () => {
    const store = createTestStore({
      loading: false,
      events: mockEvents,
      error: null,
    });

    const { container } = render(
      <Provider store={store}>
        <VideoPlayer />
      </Provider>
    );

    // Проверяем, что видео-плеер и оверлей рендерятся
    expect(container.querySelector(".video-js")).toBeInTheDocument();
    expect(screen.getByTestId("video-overlay-container")).toBeInTheDocument();
  });

  test("video player snapshot", () => {
    const store = createTestStore({
      loading: false,
      events: mockEvents,
      error: null,
    });

    const player = render(
      <Provider store={store}>
        <VideoPlayer />
      </Provider>
    );

    expect(player).toMatchSnapshot();
  });
});
