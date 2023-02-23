import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Edit, Grip, Trash } from "@/components/icons"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

import type { Task } from "@/types"

type SelectedTask = {
  index: number
  description: string
}

type TodoCardProps = {
  dragEnter: (event: React.DragEvent<HTMLLIElement>, taskId: number) => void
  dragStart: (event: React.DragEvent<HTMLLIElement>, taskId: number) => void
  drop: (event: React.DragEvent<HTMLLIElement>) => void
  editDescription: (event: React.ChangeEvent<HTMLInputElement>) => void
  editTask: () => void
  index: number
  removeTask: (taskId: number) => void
  selectedTask: SelectedTask | null
  setSelectedTask: React.Dispatch<React.SetStateAction<SelectedTask | null>>
  task: Task
}

export const TodoCard = ({
  dragEnter,
  dragStart,
  drop,
  editDescription,
  editTask,
  index,
  removeTask,
  selectedTask,
  setSelectedTask,
  task,
}: TodoCardProps) => {
  return (
    <li
      className="flex w-full flex-row items-center justify-between gap-3 hover:cursor-grab"
      onDragStart={e => dragStart(e, task.id)}
      onDragEnter={e => dragEnter(e, task.id)}
      onDragEnd={drop}
      draggable
      data-testid="task-item"
    >
      <div className="flex w-full justify-between gap-2 rounded bg-slate-200 p-2">
        <p className="text-sm">{task.description}</p>
        <Grip className="h-4 w-4" />
      </div>
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
                value={selectedTask?.description}
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
    </li>
  )
}
