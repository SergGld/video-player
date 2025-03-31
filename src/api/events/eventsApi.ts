import data from "../../public/data/events.json";
import { EventType } from "../../models/VideoEvent";

// Имитация API запроса
export const fetchEventsAPI = async (): Promise<EventType[]> => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(data);
    }, 1000)
  );
};
