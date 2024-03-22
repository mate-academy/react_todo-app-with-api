import classNames from 'classnames';
import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { DispatchContext } from '../../context/TodosContext';
import { Errors } from '../../types/Errors';
import { updateTodo } from '../../api/todos';

type Props = {
  todos: Todo[];
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: (e: React.ChangeEvent<HTMLFormElement>) => void;
  isDisabled: boolean;
  titleInput: React.RefObject<HTMLInputElement>;
  setSelectedTodo: React.Dispatch<React.SetStateAction<number[]>>;
  handleError: (message: Errors) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoTitle,
  setNewTodoTitle,
  handleAddTodo,
  isDisabled,
  titleInput,
  setSelectedTodo,
  handleError,
}) => {
  const dispatch = useContext(DispatchContext);

  const isAllCompleted = todos.every(todo => todo.completed);

  const handleStatus = (todo: Todo) => {
    setSelectedTodo(prev => [...prev, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(() => {
        dispatch({ type: 'toggleStatus', payload: todo.id });
      })
      .catch(() => handleError(Errors.update))
      .finally(() => setSelectedTodo(prev => prev.filter(n => n !== todo.id)));
  };

  const handleStatusAll = () => {
    if (isAllCompleted) {
      todos.forEach(handleStatus);
    } else {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(handleStatus);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleStatusAll}
          aria-label="toggle all button"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          name="new-todo"
          ref={titleInput}
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
