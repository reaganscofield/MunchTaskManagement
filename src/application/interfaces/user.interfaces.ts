export interface UserAttributes {
    id: string
    name: string
    email: string
    password: string
    createdAt?: Date
    updatedAt?: Date
}

export interface UserInput {
    name: string
    email: string
    password: string
}

export interface UserAuthenticationInput {
    email: string
    password: string
}

export interface UserTokenDecoded {
    id: string
    name: string
    email: string
}