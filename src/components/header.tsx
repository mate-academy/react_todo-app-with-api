import { useEffect, useRef } from 'react';
import { addTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPreparedTodos: (e: Todo[] | ((f: any[]) => any[])) => void;
  preparedTodos: Todo[];
  todos: Todo[];
  title: string;
  setTitle: (e: string) => void;
  errorMessage: string;
  setErrorMessage: (m: string) => void;
  todoId: number;
  isSubmitting: boolean;
  setIsSubmitting: (s: boolean) => void;
  setTempTodo: (o: Todo | null) => void;
  setTodosInProcess: (e: (s: number[]) => number[] | number[]) => void;
  todosInProcess: number[];
};

export const Header: React.FC<Props> = ({
  setPreparedTodos,
  preparedTodos,
  todos,
  setTitle,
  errorMessage,
  setErrorMessage,
  title,
  todoId,
  isSubmitting,
  setIsSubmitting,
  setTempTodo,
  setTodosInProcess,
  todosInProcess,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  const isCompleted = preparedTodos.filter(todo => todo.completed === false);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos, errorMessage]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage(`Title should not be empty`);

      return;
    }

    setTempTodo({
      id: 0,
      title: title.trim(),
      userId: 292,
      completed: false,
    });

    setIsSubmitting(true);

    addTodo(todoId, title.trim())
      .then(todo => {
        setTitle('');
        setErrorMessage('');
        setTempTodo(null);
        setPreparedTodos([...todos, todo]);
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage(`Unable to add a todo`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleToggleAll = () => {
    if (isCompleted.length) {
      isCompleted.forEach(todo => {
        setTodosInProcess(prevTodosIds => [...prevTodosIds, todo.id]);

        updateTodo(todo.id, !todo.completed)
          .then(() => {
            setPreparedTodos(currentTodos => {
              currentTodos
                .filter(currentTodo => currentTodo.completed === false)
                .map(notCompletedTodo => {
                  const newTodo = notCompletedTodo;

                  newTodo.completed = true;
                });

              return currentTodos;
            });
          })
          .catch(() => {
            setErrorMessage(`Unable to update a todo`);
          })
          .finally(() => setTodosInProcess(() => []));
      });
    } else {
      preparedTodos.forEach(todo => {
        setTodosInProcess(prevTodosIds => [...prevTodosIds, todo.id]);

        updateTodo(todo.id, !todo.completed)
          .then(() => {
            setPreparedTodos(currentTodos => {
              currentTodos
                .filter(currentTodo => currentTodo.completed === true)
                .map(completedTodo => {
                  const newTodo = completedTodo;

                  newTodo.completed = false;
                });

              return currentTodos;
            });
          })
          .catch(() => {
            setErrorMessage(`Unable to update a todo`);
          })
          .finally(() => setTodosInProcess(() => []));
      });
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !isCompleted.length || todosInProcess.length,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
