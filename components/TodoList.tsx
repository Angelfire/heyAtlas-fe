import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { TodoCard } from "@/components/TodoCard"
import { Loader } from "@/components/icons"

import { useToast } from "@/hooks/useToast"

import { compareArrays } from "@/lib/utils"

import { Task } from "@/types"

export function TodoList(): JSX.Element {
  const dragItem = useRef<number | null>()
  const dragOverItem = useRef<number | null>()

  const { toast } = useToast()

  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<{
    index: number
    description: string
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState<Boolean>(false)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filterTasks = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim()

    return tasks.filter(task =>
      task.description.toLowerCase().includes(normalizedQuery)
    )
  }

  const dragStart = (
    e: DragEvent<HTMLLIElement>,
    position: number | null | undefined
  ) => {
    dragItem.current = position
  }

  const dragEnter = (
    e: DragEvent<HTMLLIElement>,
    position: number | null | undefined
  ) => {
    dragOverItem.current = position
  }

  const drop = async () => {
    const copyTasks = structuredClone(tasks)
    const dragItemContent = copyTasks.find(task => task.id === dragItem.current)
    const dragItemIndex = copyTasks.findIndex(
      task => task.id === dragItem.current
    )
    const dragOverItemIndex = copyTasks.findIndex(
      task => task.id === dragOverItem.current
    )

    if (dragItemContent && dragItemIndex !== -1 && dragOverItemIndex !== -1) {
      const newOrder = structuredClone(copyTasks)

      const [dragItem] = newOrder.splice(dragItemIndex, 1)

      newOrder.splice(dragOverItemIndex, 0, dragItem)

      const updatedList = newOrder.map((task, index) => ({
        ...task,
        order_number: index + 1,
      }))

      const reorderedList = compareArrays(newOrder, updatedList)

      await fetch("http://localhost:3000/api/todos", {
        method: "PUT",
        body: JSON.stringify({ tasks: reorderedList }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      setTasks(updatedList)
    }

    dragItem.current = null
    dragOverItem.current = null
  }

  const fetchTodos = async () => {
    setIsLoading(true)
    const res = await fetch("http://localhost:3000/api/todos")
    const tasks = await res.json()

    if (!res.ok) {
      throw new Error("Failed to get tasks")
    }

    setTasks(tasks)
    setIsLoading(false)
  }

  const addTask = async (task: Task) => {
    setIsLoading(true)
    const copyTasks = structuredClone(tasks)

    const res = await fetch("http://localhost:3000/api/todos", {
      method: "POST",
      body: JSON.stringify({
        task,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to add task")
    }

    toast({
      description: "The task was added successfully",
    })

    setTasks([...copyTasks, task])
    setIsLoading(false)
  }

  const removeTask = async (id: number) => {
    setIsLoading(true)
    const copyTasks = structuredClone(tasks)

    const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      throw new Error("Failed to delete task")
    }

    const taskIndex = copyTasks.findIndex(task => task.id === id)

    if (taskIndex === -1) return // task not found in the array, do nothing

    copyTasks.splice(taskIndex, 1) // remove the task at the found index

    const reorderedTasks = copyTasks.map((task, i) => ({
      ...task,
      order_number: i + 1,
    }))

    await fetch("http://localhost:3000/api/todos", {
      method: "PUT",
      body: JSON.stringify({ tasks: reorderedTasks }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    toast({
      description: "The task was removed successfully",
    })

    setTasks(reorderedTasks)
    setIsLoading(false)
  }

  const editDescription = (evt: ChangeEvent<HTMLInputElement>) => {
    if (selectedTask === null) return

    const newDesc = (evt.target as HTMLInputElement).value

    setSelectedTask({ ...selectedTask, description: newDesc })
  }

  const editTask = async () => {
    setIsLoading(true)
    if (selectedTask === null) return

    const copyTasks = structuredClone(tasks)
    const taskId = copyTasks[selectedTask.index].id

    const res = await fetch(`http://localhost:3000/api/todos/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ description: selectedTask.description }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to edit task")
    }

    copyTasks[selectedTask.index].description = selectedTask.description

    toast({
      description: "The task was edited successfully",
    })

    setTasks(copyTasks)
    setSelectedTask(null)
    setIsLoading(false)
  }

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const input = event.currentTarget.elements.namedItem(
      "taskInput"
    ) as HTMLInputElement

    if (input && input.value.trim() !== "") {
      const newTask: Task = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        description: input.value.trim(),
        order_number: tasks.length + 1,
      }

      addTask(newTask)
      setTasks(filterTasks(input.value.trim()))
      input.value = ""
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="container flex w-full flex-col justify-center sm:w-1/2">
      <form onSubmit={handleAddTask} className="w-full">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            name="taskInput"
            placeholder="Develop a ToDo list app using React..."
          />
          <Button type="submit">Add</Button>
        </div>
      </form>
      {isLoading ? (
        <div className="mt-12" data-testid="loader">
          <p className="flex flex-col items-center gap-5 text-3xl">
            Loading tasks <Loader className="h-9 w-9 animate-spin" />
          </p>
        </div>
      ) : (
        <div className="mt-12 rounded border border-gray-200 shadow-md">
          <h2 className="my-3 text-center text-3xl">Tasks list</h2>
          {tasks.length === 0 ? (
            <p className="mb-9 text-center text-xl">
              No has agregado tareas aún
            </p>
          ) : (
            <ul className="flex w-full flex-col gap-3 px-9 pt-3 pb-9">
              {filterTasks(searchQuery).map((task, index) => (
                <TodoCard
                  key={task.id}
                  dragStart={dragStart}
                  dragEnter={dragEnter}
                  editDescription={editDescription}
                  editTask={editTask}
                  index={index}
                  task={task}
                  drop={drop}
                  removeTask={removeTask}
                  selectedTask={selectedTask}
                  setSelectedTask={setSelectedTask}
                />
              ))}
            </ul>
          )}
          <form className="w-full bg-slate-100">
            <div className="w-full">
              <div className="flex items-center space-x-2 px-9 py-3">
                <Input
                  className="bg-white"
                  type="text"
                  name="taskInput"
                  placeholder="Search task"
                  onChange={handleSearch}
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
