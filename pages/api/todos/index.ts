import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

// type Data = {
//   name: string
// }

type Task = {
  id: number
  description: string
  order_number: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
  // res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    handlePost(req, res)
  } else if (req.method === 'GET') {
    handleGet(req, res)
  } else if (req.method === 'PUT') {
    handlePut(req, res)
  } else {
    res.status(405).end()
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await supabase
      .from('todos')
      .select('*')
      .order('task_order', { ascending: true })

    const tasks = data?.map(task => ({
      id: task.id,
      description: task.task_description,
      order_number: task.task_order
    }))

    res.status(200).json(tasks)
  } catch(e: any) {
    res.status(400).json({ response: e.message })
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { task } = req.body
  const { id, description, order_number } = task

  try {
    const response = await supabase
      .from('todos')
      .insert({
        id,
        task_description: description,
        task_order: order_number 
      })
      .single()

    res.status(201).json(response)
  } catch(e: any) {
    res.status(400).json({ response: e.message })
  }
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tasks } = req.body

  const updateTasks = tasks.map((task: Task) => ({
    id: task.id,
    task_description: task.description,
    task_order: task.order_number
  }))

  try {
    await supabase
      .from('todos')
      .upsert(updateTasks)

    res.status(201).end()
  } catch(e: any) {
    res.status(400).json({ response: e.message })
  }
}
