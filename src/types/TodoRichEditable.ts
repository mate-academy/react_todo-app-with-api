import { TodoRich } from './TodoRich';

export type TodoRichEditable = Partial<Omit<TodoRich, 'id' & 'userId'>>;
