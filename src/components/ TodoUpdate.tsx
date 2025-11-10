import {Todo} from '../types/Todo'

export type TodoUpdate = Omit<Todo, 'id'> 
