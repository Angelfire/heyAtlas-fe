import { ChangeEvent, useEffect, useState } from "react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Edit, Trash } from "@/components/icons"

type Task = {
  id: number
  description: string
  order_number: number
}

export function TodoListv2() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<{
    index: number
    description: string
  } | null>(null)

  const fetchTodos = async () => {
    const res = await fetch("/api/todos")
    const tasks = await res.json()

    if (!res.ok) {
      throw new Error("Failed to get tasks")
    }

    setTasks(tasks)
  }

  const addTask = async (task: Task) => {
    const copyTasks = structuredClone(tasks)

    const res = await fetch("/api/todos", {
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

    setTasks([...copyTasks, task])
  }

  const removeTask = async (id: number) => {
    const copyTasks = structuredClone(tasks)

    const res = await fetch(`/api/todos/${id}`, {
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

    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({ tasks: reorderedTasks }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    setTasks(reorderedTasks)
  }

  const editDescription = (evt: ChangeEvent<HTMLInputElement>) => {
    if (selectedTask === null) return

    const newDesc = (evt.target as HTMLInputElement).value

    setSelectedTask({ ...selectedTask, description: newDesc })
  }

  const editTask = async () => {
    if (selectedTask === null) return

    const copyTasks = structuredClone(tasks)
    const taskId = copyTasks[selectedTask.index].id

    const res = await fetch(`/api/todos/${taskId}`, {
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

    setTasks(copyTasks)
    setSelectedTask(null)
  }

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const input = event.currentTarget.elements.namedItem(
      "taskInput"
    ) as HTMLInputElement

    if (input && input.value.trim() !== "") {
      const newTask: Task = {
        id: Date.now() + Math.floor(Math.random() * 1000), // Esto es horrible, pero funciona
        description: input.value.trim(),
        order_number: tasks.length + 1,
      }

      addTask(newTask)

      input.value = ""
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="container flex w-full flex-col justify-center gap-5 sm:w-1/2">
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
      <ul className="flex w-full flex-col gap-3">
        {tasks?.map((task, index) => (
          <li
            key={task.id}
            className="flex w-full flex-row items-center justify-between gap-5 "
          >
            <div className="flex w-full justify-between gap-2 rounded bg-slate-200 p-2">
              <p className="text-sm">{task.description}</p>
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() =>
                        setSelectedTask({
                          index,
                          description: task.description,
                        })
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        id="description"
                        value={selectedTask?.description || ""}
                        onChange={e => editDescription(e)}
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button onClick={editTask}>Save changes</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTask(task.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
