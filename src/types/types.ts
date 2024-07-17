export type Task = {
  id: string
  todo: string
  completed: boolean
  userId: string
}

export type Tasks = {
  pending: Task[]
  completed: Task[]
}

export type TaskStatus = 'pending' | 'completed'
