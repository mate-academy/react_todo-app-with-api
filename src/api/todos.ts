import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2462;




export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};



export function updateTodoOnServer( todo : Todo)  {
  return client.patch<Todo>( `/todos/${todo.id}` , todo)
}



export function updateTodosCheckbox(  {id} : Todo , completed_status : boolean)  {
  return client.patch<Todo>(`/todos/${id}`, { completed : completed_status });
}


export function createTodo({title  , userId , completed} : Omit<Todo, "id">)  {
  return client.post<Todo>('/todos/' , {title , userId , completed})
}


export function deleteTodos(todoId : number)  {
  return client.delete(`/todos/${todoId}`)
}
