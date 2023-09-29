import { useToDoContext } from '../../context/ToDo.context';
import { Todo } from '../../types/Todo';
import { useTodoEdit } from '../ToDoList/useTodoEdit';
import { Filter } from './types';

export const useTodoFilter = () => {
  const { todos, setTodoFilter, todoFilter } = useToDoContext();
  const { deleteTodo } = useTodoEdit();

  const changeFilter = (type:Filter) => setTodoFilter(type);

  const clearCompleted = () => todos
    .filter(({ completed }:Todo) => completed).forEach(deleteTodo);

  const active = todos.filter(({ completed }:Todo) => !completed).length;

  // eslint-disable-next-line no-console
  console.log('Wynik todos:', todos);

  return {
    changeFilter,
    active,
    activeFilter: todoFilter,
    clearCompleted,
  };
};
