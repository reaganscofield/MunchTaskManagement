export interface TaskLinkAttributes {
    id: string
    userId: string
    taskId: string
    createdAt?: Date
    updatedAt?: Date
}

export interface TaskLinkInput {
    userId: string
    taskId: string
}