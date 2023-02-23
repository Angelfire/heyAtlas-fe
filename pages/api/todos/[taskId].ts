import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    handleDelete(req, res)
  } else if (req.method === 'PATCH') {
    handlePatch(req, res)
  } else {
    res.status(405).end()
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { taskId } = req.query

  try {
    await supabase
      .from('todos')
      .delete()
      .eq('id', taskId)

    res.status(204).end()
  } catch (e: any) {
    res.status(400).json({ response: e.message })
  }
}

async function handlePatch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { taskId } = req.query
  const { description } = req.body

  try {
    await supabase
      .from('todos')
      .update({ task_description: description })
      .eq('id', taskId)

    res.status(204).end()
  } catch (e: any) {
    res.status(400).json({ response: e.message })
  }
}
