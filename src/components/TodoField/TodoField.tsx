import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../ErrorMessage/ErrorMessage';

type Props = {
  newToField: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  onAdd: (newTodoData: string) => void;
  todoName: string;
  setNewTodoName: (name: string) => void;
  setErrorType: (error: ErrorType) => void;
  isAdding: boolean;
  setErrorClosing: (er: boolean) => void;
  onUpdate: (todoId: number, done: boolean, title: string) => void;
};

export const TodoField: React.FC<Props> = ({
  todos,
  todoName,
  onAdd,
  setNewTodoName,
  setErrorType,
  isAdding,
  setErrorClosing,
  newToField,
  onUpdate,
}) => {
  const completedAllTodos = todos.every((todo) => todo.completed === true);

  const handleFormSubmit = (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();

    if (!todoName.trim()) {
      setErrorType(ErrorType.Blanc);
      setErrorClosing(false);
    }

    if (todoName.trim()) {
      onAdd(todoName);
      setErrorType(ErrorType.None);
    }

    setTimeout(() => newToField.current?.focus(), 500);
  };

  const handleInput = (event: {
    target: { value: string; };
  }) => {
    setNewTodoName(event.target.value);
  };

  const handleStatusOnToggle = () => todos.map(({ id, title }) => {
    setErrorClosing(false);

    if (completedAllTodos) {
      return onUpdate(id, false, title);
    }

    return onUpdate(id, true, title);
  });

  return (
    <>
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            ('todoapp__toggle-all'),
            { active: completedAllTodos },
          )}
          aria-label="Toggle"
          onClick={handleStatusOnToggle}
        />
      )}
      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          disabled={isAdding}
          className="todoapp__new-todo"
          placeholder="What me do?"
          ref={newToField}
          value={todoName}
          onChange={handleInput}
        />
      </form>
    </>
  );
};
