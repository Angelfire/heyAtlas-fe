// import { render, screen, fireEvent } from "@testing-library/react"
// import { TodoList } from "@/components/TodoList"
// import type { Task } from "@/components/TodoList"

// import nock from "nock"

// describe("TodoList", () => {
//   const tasks: Task[] = [
//     { id: 1, description: "Task 1", order_number: 1 },
//     { id: 2, description: "Task 2", order_number: 2 },
//     { id: 3, description: "Task 3", order_number: 3 },
//     { id: 4, description: "Task 4", order_number: 4 },
//   ]

//   beforeEach(() => {
//     nock("http://localhost:3000/api")
//       .get("/todos")
//       .reply(200, tasks)
//       .post("/todos", {
//         task: { id: 5, description: "Task 5", order_number: 5 },
//       })
//       .reply(200)
//       .delete("/todos/1")
//       .reply(200)
//       .put("/todos", { tasks: [] })
//       .reply(200)
//   })

//   it("renders TodoList loader", async () => {
//     render(<TodoList />)

//     expect(await screen.findByText("Loading tasks")).toBeInTheDocument()
//   })

//   it.skip("renders a list of tasks", async () => {
//     render(<TodoList />)
//     expect(await screen.findAllByRole("listitem")).toHaveLength(4)
//   })

//   it.skip("adds a new task", async () => {
//     render(<TodoList />)
//     fireEvent.change(screen.getByPlaceholderText("Add a new task"), {
//       target: { value: "Task 5" },
//     })
//     fireEvent.click(screen.getByRole("button", { name: "Add" }))
//     expect(await screen.findByText("Task 5")).toBeInTheDocument()
//   })

//   it.skip("deletes a task", async () => {
//     render(<TodoList />)
//     fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0])
//     expect(await screen.findAllByRole("listitem")).toHaveLength(3)
//   })

//   it.skip("reorders tasks", async () => {
//     render(<TodoList />)
//     const firstTask = screen.getAllByRole("listitem")[0]
//     const thirdTask = screen.getAllByRole("listitem")[2]
//     fireEvent.dragStart(firstTask)
//     fireEvent.dragEnter(thirdTask)
//     fireEvent.drop(thirdTask)
//     expect(await screen.findAllByRole("listitem")[2]).toHaveTextContent(
//       "Task 1"
//     )
//   })

//   it.skip("filters tasks", async () => {
//     render(<TodoList />)
//     fireEvent.change(screen.getByPlaceholderText("Search tasks"), {
//       target: { value: "Task 2" },
//     })
//     expect(await screen.findAllByRole("listitem")).toHaveLength(1)
//   })
// })

import { render, screen, fireEvent } from "@testing-library/react"
import { TodoList } from "@/components/TodoList"
import nock from "nock"

const mockData = [
  {
    id: 1,
    description: "Todo 1",
    order_number: 1,
  },
  {
    id: 2,
    description: "Todo 2",
    order_number: 2,
  },
  {
    id: 3,
    description: "Todo 3",
    order_number: 3,
  },
]

describe("TodoList", () => {
  beforeEach(() => {
    nock("http://localhost:3000/api/todos").get("").reply(200, mockData)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it("renders a list of todos", async () => {
    render(<TodoList />)
    const todo1 = await screen.findByText("Todo 1")
    const todo2 = await screen.findByText("Todo 2")
    const todo3 = await screen.findByText("Todo 3")

    expect(todo1).toBeInTheDocument()
    expect(todo2).toBeInTheDocument()
    expect(todo3).toBeInTheDocument()
  })

  it("adds a new task", async () => {
    const newTask = {
      id: 4,
      description: "Todo 4",
      order_number: 4,
    }

    nock("http://localhost:3000")
      .post("/api/todos", { task: newTask })
      .reply(200, newTask)

    render(<TodoList />)
    const input = await screen.findByPlaceholderText(
      /Develop a ToDo list app using React.../i
    )
    const button = await screen.findByRole("button", { name: /Add/i })

    fireEvent.change(input, { target: { value: newTask.description } })
    fireEvent.click(button)

    const addedTask = await screen.findByText(newTask.description)
    expect(addedTask).toBeInTheDocument()
  })

  it("removes a task", async () => {
    const taskToRemove = mockData[1]
    nock("http://localhost:3000")
      .delete(`/api/todos/${taskToRemove.id}`)
      .reply(200)

    render(<TodoList />)
    const task2 = await screen.findByText(taskToRemove.description)
    const deleteButton = task2.querySelector("button")

    fireEvent.click(deleteButton)

    await expect(
      screen.queryByText(taskToRemove.description)
    ).not.toBeInTheDocument()
  })

  it("reorders tasks when a drag and drop event happens", async () => {
    const reorderedList = [mockData[1], mockData[2], mockData[0]]
    nock("http://localhost:3000").put("/api/todos").reply(200, reorderedList)

    render(<TodoList />)
    const task1 = await screen.findByText(mockData[0].description)
    const task2 = await screen.findByText(mockData[1].description)
    const task3 = await screen.findByText(mockData[2].description)

    fireEvent.dragStart(task2)
    fireEvent.dragEnter(task1)
    fireEvent.drop(task1)

    const updatedTask1 = await screen.findByText(reorderedList[0].description)
    const updatedTask2 = await screen.findByText(reorderedList[1].description)
    const updatedTask3 = await screen.findByText(reorderedList[2].description)

    expect(updatedTask1).toBeInTheDocument()
    expect(updatedTask2).toBeInTheDocument()
    expect(updatedTask3).toBeInTheDocument()
  })
})
