import { useContext } from 'react';
import { TodoContext } from '../providers/TodoProvider';
import { FormContext } from '../providers/FormProvider';
import { deleteTodo } from '../api/todos';
import { TodoError } from '../types/TodoError';

export const ClearButton = () => {
  const {
    todos,
    setTodos,
    setError,
    inputRef,
  } = useContext(TodoContext);

  const { setIsClearing } = useContext(FormContext);

  const isPresentCompleted = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    setIsClearing(true);

    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosIds.forEach(id => {
      deleteTodo(id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        })
        .catch(() => {
          setError(TodoError.Delete);
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }

          setIsClearing(false);
        });
    });
  };

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!isPresentCompleted}
      onClick={handleClearCompleted}
    >
      Clear completed
    </button>
  );
};
