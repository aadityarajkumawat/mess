import { User } from '@prisma/client'

export interface UserResponse {
    error: string | null
    user: Omit<User, 'password'> | null
}

export interface LoginInput {
    email: string
    password: string
}

export interface RegisterInput extends LoginInput {
    name: string
    username: string
    city: string
    state: string
}

export interface CreateEventInput {
    interest: string
    eventName: string
    venue: string
    date: string
    timeStart: string
    timeEnd: string
    description: string
}

export interface Event {
    id: number
    userId: number
    eventName: string
    timeStart: string
    timeEnd: string
    venue: string
    description: string
    interest: string
    organizer: string
}

export interface MutationResponse {
    status: 'OK' | 'NOT_OK'
    error: string | null
}

export interface GetEventsResponse {
    events: Array<Event>
    error: string | null
}

export interface SendInviteInput {
    to: number
    event: number
}

export interface Profile {
    image: string
    name: string
    bio: string
    eventsHosted: number
    eventsAttended: number
}

export interface GetProfileResponse {
    profile: Profile | null
    error: string | null
}

export interface Invite {
    eventName: string
    organizer: string
    image: string
    description: string
}
