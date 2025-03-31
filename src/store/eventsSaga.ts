import { call, put, takeLatest } from "redux-saga/effects";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { all } from "redux-saga/effects";
import { EventType } from "../models/VideoEvent";
import { fetchEventsAPI } from "../api/events/eventsApi";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [] as EventType[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    fetchEvents: (state) => {
      state.loading = true;
    },
    fetchEventsSuccess: (state, action: PayloadAction<EventType[]>) => {
      state.events = action.payload;
      state.loading = false;
    },
    fetchEventsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchEvents, fetchEventsSuccess, fetchEventsFailure } =
  eventsSlice.actions;
export default eventsSlice.reducer;

// Saga для загрузки событий
export function* fetchEventsSaga() {
  try {
    const events: EventType[] = yield call(fetchEventsAPI);
    yield put(fetchEventsSuccess(events));
  } catch (error) {
    yield put(fetchEventsFailure("Ошибка загрузки событий"));
  }
}

export function* watchEventsSaga() {
  yield takeLatest(fetchEvents.type, fetchEventsSaga);
}

// Корневая Saga
export function* rootSaga() {
  yield all([watchEventsSaga()]);
}
