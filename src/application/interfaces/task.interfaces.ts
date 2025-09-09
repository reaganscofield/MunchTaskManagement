import { TaskStatuses } from '../../shared/taskEnums';

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface TaskAttributes {
    id: string
    title: string
    description?: string | null
    dueDate?: Date | null
    priority?: TaskPriority
    status: TaskStatus
    createdByUserId: string
    createdAt?: Date
    updatedAt?: Date
}

export interface TaskInput {
    title: string
    description?: string | null
    dueDate?: Date | null
    priority?: TaskPriority
    status: TaskStatus
    createdByUserId: string
}

export interface TaskQueryParams {
    status?: keyof typeof TaskStatuses
    sortBy?: 'dueDate' | 'priority'
    sortOrder?: 'asc' | 'desc'
}
