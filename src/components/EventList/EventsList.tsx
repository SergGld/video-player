import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FixedSizeList } from "react-window";
import { EventType } from "../../models/VideoEvent";

// Компонент элемента списка
const EventItem = styled.div`
  cursor: pointer;
  font-size: 14px;
  color: #007bff;
  padding: 8px;
  border-radius: 5px;
  background-color: #fff;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin-bottom: 8px; /* Отступы между элементами */
  box-sizing: border-box;

  &:hover {
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
  }
`;

// Контейнер списка
const EventsListContainer = styled.div`
  margin-top: 20px;
  padding: 0;
  list-style-type: none;
  background-color: #f4f4f4;
  border-radius: 8px;
  width: 100%;
  overflow-x: hidden; /* Убираем горизонтальный скролл */
`;

interface EventsListProps {
  handleEventClick: (timestamp: number) => void;
  height?: number;
}

interface RowData {
  events: EventType[];
  handleEventClick: (timestamp: number) => void;
}

const renderRow = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: RowData;
}) => {
  const { events, handleEventClick } = data;
  const event = events[index];

  return (
    <EventItem onClick={() => handleEventClick(event.timestamp)} style={style}>
      {format(new Date(event.timestamp * 1000), "mm:ss.SSS")}
    </EventItem>
  );
};

const EventsList: React.FC<EventsListProps> = ({
  height,
  handleEventClick,
}) => {
  const { events, loading, error } =
    useSelector((state: RootState) => state.events) ?? {};

  const itemHeight = 40;

  return (
    <EventsListContainer>
      {loading && <p>Загрузка событий...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}

      {events && (
        <FixedSizeList // Виртуализация, на случай если событий будет очень много
          height={height || 650}
          itemCount={events.length}
          itemSize={itemHeight}
          width="100%"
          itemData={{ events, handleEventClick }}
        >
          {renderRow}
        </FixedSizeList>
      )}
    </EventsListContainer>
  );
};

export default EventsList;
