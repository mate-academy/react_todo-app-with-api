import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ToggleAllButton: React.FC<Props> = ({
  todos,
  setTodos,
  setLoadingTodoIds,
  setErrorMessage,
}) => {
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  function handleToggleAll() {
    setErrorMessage('');

    const todosToUpdate = todos.filter(
      todo => todo.completed === isAllTodosCompleted,
    );

    setLoadingTodoIds(todosToUpdate.map(t => t.id));

    Promise.all(
      todosToUpdate.map(todo =>
        updateTodo({ ...todo, completed: !isAllTodosCompleted }),
      ),
    )
      .then(updatedTodos => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.map(todo => {
            const updated = updatedTodos.find(t => t.id === todo.id);

            return updated || todo;
          });
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  }

  return (
    <>
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted && todos.length > 0,
          })}
          onClick={handleToggleAll}
        />
      )}
    </>
  );
};
