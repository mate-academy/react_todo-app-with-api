import { TodoWithMode } from './TodoWithMode';

export type TodoDataToUpdate = Partial<Omit<TodoWithMode, 'id' & 'userId'>>;
