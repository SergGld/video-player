import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import eventsReducer from "./eventsSaga";
import { rootSaga } from "./eventsSaga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware), // Тут в саге нет необходимости, но раз уж желательно её использовать, делаем
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
