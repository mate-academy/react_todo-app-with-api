import { useToDoContext } from '../../context/ToDo.context';
import { Todo } from '../../types/Todo';
import { useTodoRow } from '../ToDoList/useTodoRow';

export const useToggleAll = () => {
  const { todos } = useToDoContext();
  const { saveTodo } = useTodoRow();

  const toggleAll = () => {
    if (todos.active.length > 0) {
      todos.active.forEach((todo:Todo) => saveTodo({
        ...todo,
        completed: true,
      }));

      return;
    }

    if (todos.active.length === 0 && todos.completed.length > 0) {
      todos.completed.forEach((todo:Todo) => saveTodo({
        ...todo,
        completed: false,
      }));
    }
  };

  return {
    toggleAll,
    isActive: todos.active.length === 0,
    isVisible: todos.all.length > 0,
  };
};
