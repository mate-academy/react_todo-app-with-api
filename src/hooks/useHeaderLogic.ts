import { updateTodos } from '../helpers';
import { Todo } from '../types';
import { useAppContext } from './useAppContext';

export const useHeaderLogic = () => {
  const { todos, setTodos, setErrorType, setTodoDeleteId } = useAppContext();

  const allCompleted = todos.every(todo => todo.completed === true);

  const toggleCompletion = (todosArr: Todo[], idsArr: number[]) =>
    todosArr.map(todo =>
      idsArr.includes(todo.id) ? { ...todo, completed: !todo.completed } : todo,
    );

  const getTodosToUpdate = () => {
    if (allCompleted) {
      return todos;
    } else {
      return todos.filter(el => !el.completed);
    }
  };

  const updateTodo = async (todo: Todo) => {
    try {
      await updateTodos(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
    } catch (err) {
      setErrorType('update');
      throw new Error();
    }
  };

  const onToggleAllClick = async () => {
    const todosToUpdate = getTodosToUpdate();
    const idToUpdate = todosToUpdate.map(todo => todo.id);

    setTodoDeleteId(idToUpdate);

    try {
      await Promise.all(todosToUpdate.map(updateTodo));

      setTodos(currentTodos => toggleCompletion(currentTodos, idToUpdate));
    } catch (err) {
      setErrorType('update');
    } finally {
      setTodoDeleteId(null);
    }
  };

  return { onToggleAllClick, allCompleted, todos };
};
