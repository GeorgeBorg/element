import React, { FC, useState, createContext } from "react"
import useAppContext from "../../lib/hooks/useAppContext"
import { useCallback } from "react"
import { useContext } from "react"
import { ElementFragment, TaskFragment } from "../../lib/graphql/types"
import { useAllTasks } from "../../lib/graphql/task/hooks"
import useDebounce from "../../lib/hooks/useDebounce"

const TimelineProvider: FC = ({ children }) => {
  const { user } = useAppContext()
  const [modal, setModal] = useState("")
  const [selectedElement, setSelectedElement] = useState()
  const [selectedUserId, setSelectedUserId] = useState(user.id)
  const [daysBack, setDaysBack] = useState(20)
  const [daysForward, setDaysForward] = useState(20)

  const handleSetModal = useCallback(setModal, [setModal])
  const handleSelectUser = useCallback(setSelectedUserId, [setSelectedUserId])
  const handleSetElement = useCallback(setSelectedElement, [setSelectedElement])
  const handleDaysForward = useCallback(setDaysForward, [setDaysForward])
  const handleDaysBack = useCallback(setDaysBack, [setDaysBack])
  const allTasks = useAllTasks(selectedUserId)

  const isLoading = useDebounce(allTasks, 500)

  return (
    <TimelineContextProvider
      value={{
        selectedUserId,
        handleSelectUser,
        modal,
        handleSetModal,
        handleSetElement,
        selectedElement,
        daysForward,
        daysBack,
        handleDaysForward,
        handleDaysBack,
        allTasks,
        isLoading,
      }}
    >
      {children}
    </TimelineContextProvider>
  )
}

export default TimelineProvider

interface TimelineContext {
  selectedUserId: string
  handleSelectUser: (userId: string) => void
  modal: string
  selectedElement: ElementFragment
  handleSetModal: (modal: string) => void
  handleSetElement: (element: ElementFragment) => void
  daysForward: number
  daysBack: number
  handleDaysForward: (days: number) => void
  handleDaysBack: (days: number) => void
  allTasks: TaskFragment[]
  isLoading: boolean
}

const TimelineContext = createContext<TimelineContext | undefined>(undefined)
const TimelineContextProvider = TimelineContext.Provider

export function useTimelineContext() {
  const context = useContext(TimelineContext)
  if (!context) throw new Error("no timeline contect")
  return context
}
