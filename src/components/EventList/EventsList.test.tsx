import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import eventsReducer from "../../store/eventsSaga";
import { format } from "date-fns";
import EventsList from "./EventsList";

const createTestStore = (initialState: any) => {
  return configureStore({
    reducer: {
      events: eventsReducer,
    },
    preloadedState: { events: initialState },
  });
};

describe("EventsList Component", () => {
  let handleEventClick: jest.Mock;

  beforeEach(() => {
    handleEventClick = jest.fn();
  });

  test("renders loading message when loading", () => {
    const store = createTestStore({ loading: true, events: [], error: null });

    render(
      <Provider store={store}>
        <EventsList handleEventClick={handleEventClick} />
      </Provider>
    );

    expect(screen.getByText(/Загрузка событий.../i)).toBeInTheDocument();
  });

  const errorText = "Ошибка сети";
  test("renders error message when there is an error", () => {
    const store = createTestStore({
      loading: false,
      events: [],
      error: errorText,
    });

    render(
      <Provider store={store}>
        <EventsList handleEventClick={handleEventClick} />
      </Provider>
    );

    expect(
      screen.getByText(new RegExp(`Ошибка: ${errorText}`, "i"))
    ).toBeInTheDocument();
  });

  test("renders events and handles click", () => {
    const mockEvents = [{ timestamp: 1640995200 }, { timestamp: 1640995260 }];
    const store = createTestStore({
      loading: false,
      events: mockEvents,
      error: null,
    });

    render(
      <Provider store={store}>
        <EventsList handleEventClick={handleEventClick} />
      </Provider>
    );

    mockEvents.forEach((event) => {
      const formattedTime = format(
        new Date(event.timestamp * 1000),
        "mm:ss.SSS"
      );
      const eventItem = screen.getByText(formattedTime);
      expect(eventItem).toBeInTheDocument();
      fireEvent.click(eventItem);
      expect(handleEventClick).toHaveBeenCalledWith(event.timestamp);
    });
  });
});
