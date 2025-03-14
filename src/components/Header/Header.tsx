import { useMemo, useState } from 'react';
import { postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { USER_ID } from '../../api/todos';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  onAddTodo: (newTodo: Todo) => void;
  onAddTemporaryTodo: (tempoTodo: Todo | null) => void;
  onError: (error: ErrorMessage | null) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleTodoStatus: (id: number) => void;
};

export const Header = ({
  todos,
  onAddTodo,
  onAddTemporaryTodo,
  onError,
  inputRef,
  onToggleTodoStatus,
}: Props) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAllTodos = async () => {
    const filteredTodos = todos.filter(todo => !todo.completed);
    const todosToToggle = filteredTodos.length > 0 ? filteredTodos : todos;

    await Promise.all(todosToToggle.map(todo => onToggleTodoStatus(todo.id)));
  };

  const addNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const addTodo = async () => {
      try {
        if (!newTodoTitle.trim()) {
          throw new Error(ErrorMessage.EMPTY_TITLE);
        }

        const tempTodo: Todo = {
          title: newTodoTitle.trim(),
          userId: USER_ID,
          completed: false,
        };

        const newTodo: Todo = {
          title: newTodoTitle.trim(),
          userId: USER_ID,
          completed: false,
        };

        onAddTemporaryTodo(tempTodo);

        const response = await postTodo(newTodo);

        if (!response) {
          throw new Error(ErrorMessage.ADD_TODO);
        }

        onAddTodo(response);

        setNewTodoTitle('');
        setIsSubmitting(false);
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === ErrorMessage.EMPTY_TITLE
        ) {
          onError(ErrorMessage.EMPTY_TITLE);
        } else {
          onError(ErrorMessage.ADD_TODO);
        }
      } finally {
        setIsSubmitting(false);
        onAddTemporaryTodo(null);

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);

        setTimeout(() => {
          onError(null);
        }, 3000);
      }
    };

    addTodo();
  };

  const areAllTodosCompleted: boolean = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          autoFocus
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
