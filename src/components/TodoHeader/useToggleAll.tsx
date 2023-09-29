import { useToDoContext } from '../../context/ToDo.context';
import { Todo } from '../../types/Todo';
import { useTodoEdit } from '../ToDoList/useTodoEdit';

export const useToggleAll = () => {
  const {
    todos,
  } = useToDoContext();
  const { saveTodo } = useTodoEdit();

  const active = !todos.some(({ completed }:Todo) => !completed);
  const isVisible = todos.length > 0;

  const toggleAll = () => {
    const activeTodos = todos.filter(({ completed }:Todo) => !completed);
    const completedTodos = todos.filter(({ completed }:Todo) => completed);

    if (activeTodos.length > 0) {
      activeTodos.forEach((todo:Todo) => saveTodo({
        ...todo,
        completed: true,
      }));

      return;
    }

    if (activeTodos.length === 0 && completedTodos.length > 0) {
      completedTodos.forEach((todo:Todo) => saveTodo({
        ...todo,
        completed: false,
      }));
    }
  };

  return { toggleAll, active, isVisible };
};
