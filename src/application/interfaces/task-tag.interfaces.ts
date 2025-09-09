export interface TaskTagAttributes {
    id: string
    taskId: string
    tagId: string
    createdAt?: Date
    updatedAt?: Date
}

export interface TaskTagInput {
    taskId: string
    tagIds: string[]
}