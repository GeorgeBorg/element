import React, { memo } from "react"
import styled from "styled-components"
import { Dayjs } from "dayjs"
import { Droppable, Draggable } from "react-beautiful-dnd"
import { useDisclosure } from "@chakra-ui/core"

import Task from "./Task"

import { calculateTotalTime, isToday } from "../lib/helpers"
import { TaskFragment } from "../lib/graphql/types"
import { darken } from "polished"
import dayjs from "dayjs"
// import { useTimelineContext } from "./providers/TimelineProvider"
import { media } from "../application/theme"
import { useMe } from "./providers/MeProvider"
import deepEqual from "deep-equal"
import TaskModal from "./TaskModal"

interface DayProps {
  day: Dayjs
  tasks: TaskFragment[]
  selectedUserId: string
}
function Day({ day, tasks, selectedUserId, ...props }: DayProps) {
  const { isOpen, onClose, onOpen } = useDisclosure()
  // const { selectedUserId } = useTimelineContext()
  const user = useMe()
  const weekend = dayjs(day).day() === 0 || dayjs(day).day() === 6
  return (
    <>
      <StyledBorder
        monday={dayjs(day).day() === 1}
        first={dayjs(day).date() === 1}
        currentUser={
          (selectedUserId && user && selectedUserId === user.id) || false
        }
      >
        <Droppable droppableId={day.toString()}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <StyledDay weekend={weekend} today={isToday(day)} {...props}>
                {tasks
                  ?.sort((a, b) => a.order - b.order)
                  .map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          key={index}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task isDragging={snapshot.isDragging} task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                <StyledTotalTime dragging={snapshot.isDraggingOver}>
                  {calculateTotalTime(tasks)}
                </StyledTotalTime>

                {provided.placeholder}
                <AddNewTask onClick={onOpen}>
                  <PlaceholderTask />
                </AddNewTask>
              </StyledDay>
            </div>
          )}
        </Droppable>
      </StyledBorder>

      {isOpen && (
        <TaskModal
          isOpen={isOpen}
          onClose={onClose}
          scheduledDate={day.format()}
        />
      )}
    </>
  )
}

export default memo(Day, dayIsEqual)

function dayIsEqual(prevDay: DayProps, nextDay: DayProps) {
  if (prevDay.selectedUserId !== nextDay.selectedUserId) {
    return false
  }
  return deepEqual(prevDay.tasks, nextDay.tasks)
}

const StyledBorder = styled.div<{
  monday: boolean
  first: boolean
  currentUser: boolean
}>`
  display: flex;
  border-left: ${p => p.monday && "5px #efefef dotted"};
  border-left: ${p => p.first && `5px ${p.theme.colorLightBlue} dotted`};
  min-height: ${p =>
    p.currentUser ? `calc(100vh - 174px)` : `calc(100vh - 143px)`};

  ${p => media.greaterThan("md")`
    min-height: ${
      p.currentUser ? `calc(100vh - 174px)` : `calc(100vh - 143px)`
    };
  `}
`

const StyledDay = styled.div<{ weekend: boolean; today: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 98px;
  height: 100%;
  font-size: ${p => p.theme.textS};
  background-color: ${p =>
    p.today ? p.theme.colorBlue : p.theme.colorBackground};

  box-sizing: content-box;
  border-top: none;
  padding-bottom: ${p => (p.today ? "20px" : "0")};
  transition: height -0.3s linear 2s;
`

const PlaceholderTask = styled.div`
  min-width: calc(100% - ${p => p.theme.paddingS});
  height: 64px;
`

const StyledTotalTime = styled.div<{ dragging: boolean }>`
  color: ${p => p.theme.colorLabel};
  display: flex;
  justify-content: center;
  margin-top: ${p => (p.dragging ? "74px" : 0)};
`

const AddNewTask = styled.div`
  cursor: pointer;
  margin: ${p => p.theme.paddingS};
  flex: 1;

  &:hover ${PlaceholderTask} {
    background-color: ${p => darken(0.02, p.theme.colorLightBlue)};
  }
`
