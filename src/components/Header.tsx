/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { ErrorType } from '../utils/ErrorType';
import { Todo } from '../types/Todo';

type Props = {
  newTodo: string,
  setNewTodo: (todo: string) => void,
  sendTodo: (todoData: Todo) => void,
  isAnyActiveTodo: boolean,
  errorNotification: (value: ErrorType) => void,
  isInputDisabled: boolean,
  toggleAllTodoStatus: () => void,
  todos: Todo[],
};

export const Header: React.FC<Props> = ({
  newTodo,
  setNewTodo,
  sendTodo,
  isAnyActiveTodo,
  errorNotification,
  isInputDisabled,
  toggleAllTodoStatus,
  todos,
}) => {
  const handleSubmitForm = () => {
    if (newTodo.trim() === '') {
      errorNotification(ErrorType.Empty);

      return;
    }

    const tempTodo: Todo = {
      title: newTodo,
      id: 0,
      userId: 10360,
      completed: false,
    };

    sendTodo(tempTodo);
    setNewTodo('');
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', { active: !isAnyActiveTodo },
          )}
          onClick={() => {
            toggleAllTodoStatus();
          }}
        />
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmitForm();
        }}
      >
        <input
          disabled={isInputDisabled}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(event) => {
            setNewTodo(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
