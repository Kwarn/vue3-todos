export type Task = {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export type Tasks = {
  pending: Task[]
  completed: Task[]
}

export type TaskStatus = 'pending' | 'completed'
