import { testSaga } from "redux-saga-test-plan";
import { call, put } from "redux-saga/effects";
import { fetchEventsSaga } from "../store/eventsSaga";
import { fetchEventsSuccess, fetchEventsFailure } from "../store/eventsSaga";
import { EventType } from "../models/VideoEvent";
import { fetchEventsAPI } from "../api/events/eventsApi";

describe("fetchEventsSaga", () => {
  it("успешный запрос данных", () => {
    const mockEvents: EventType[] = [
      {
        timestamp: 10,
        duration: 5,
        zone: { left: 10, top: 10, width: 50, height: 50 },
      },
    ];

    testSaga(fetchEventsSaga)
      .next()
      .call(fetchEventsAPI)
      .next(mockEvents)
      .put(fetchEventsSuccess(mockEvents))
      .next()
      .isDone();
  });

  it("ошибка запроса данных", () => {
    const error = new Error("Ошибка загрузки");

    testSaga(fetchEventsSaga)
      .next()
      .call(fetchEventsAPI)
      .throw(error)
      .put(fetchEventsFailure("Ошибка загрузки событий"))
      .next()
      .isDone();
  });
});
