import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';
import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>,
  userId: number,
  setErrorMessage: Dispatch<SetStateAction<ErrorMessages>>,
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  tempTodo: Todo | null,
  isAllTodosCompleted: boolean,
  toggleAll: () => void,
};

export const Header: React.FC<Props> = ({
  setTempTodo,
  tempTodo,
  userId,
  setErrorMessage,
  setTodos,
  isAllTodosCompleted,
  toggleAll,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');

  const handleAddingTodo = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!todoTitle.trim().length) {
        setErrorMessage(ErrorMessages.OnEmptyAdd);

        return;
      }

      setErrorMessage(ErrorMessages.NoError);
      setTempTodo({
        id: 0,
        userId,
        title: todoTitle,
        completed: false,
      });

      const newTodo = await createTodo(todoTitle, userId);

      setTodoTitle('');

      setTodos((prevTodos: Todo[]): Todo[] => {
        return [...prevTodos, newTodo];
      });
    } catch (error) {
      setErrorMessage(ErrorMessages.OnAdd);
    } finally {
      setTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isAllTodosCompleted },
        )}
        aria-label="Add todo"
        onClick={toggleAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddingTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!tempTodo}
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
