import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { GlobalContext } from '../GlobalContextProvider';
import * as TodosApi from '../../api/todos';

/* eslint-disable jsx-a11y/control-has-associated-label */

interface Props {
  titleField: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = React.memo(({ titleField }) => {
  const {
    userId,
    todos,
    setTodos,
    setTempTodo,
    setErrorMessage,
    setSelectedTodosIds,
  } = useContext(GlobalContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (titleField.current && !isLoading) {
      titleField.current.focus();
    }
  }, [isLoading, titleField]);

  const onFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!newTodoTitle.trim()) {
      setErrorMessage(Errors.emptyTitle);
    } else {
      const newTodo: Omit<Todo, 'id'> = {
        userId,
        title: newTodoTitle.trim(),
        completed: false,
      };

      setSelectedTodosIds(idsToLoad => [...idsToLoad, 0]);
      setTempTodo({ ...newTodo, id: 0 });
      setIsLoading(true);

      TodosApi.addTodo(newTodo)
        .then((createdTodo) => {
          setTodos(tasks => [...tasks, createdTodo]);
          setNewTodoTitle('');
        })
        .catch(() => setErrorMessage(Errors.addTodoError))
        .finally(() => {
          setIsLoading(false);
          setTempTodo(null);
          setSelectedTodosIds(idsToLoad => idsToLoad.filter(id => id !== 0));
        });
    }
  }, [
    newTodoTitle,
    userId,
    setTempTodo,
    setErrorMessage,
    setTodos,
    isLoading,
    setSelectedTodosIds,
  ]);

  const onInputChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  }, []);

  const hasActiveTodo = useMemo(() => {
    return todos.some(todo => !todo.completed);
  }, [todos]);

  const handleToggleAll = useCallback(() => {
    const todosToToggle = todos
      .filter(todo => {
        if (hasActiveTodo) {
          return !todo.completed;
        }

        return todo.completed;
      });

    const todosToToggleIds = todosToToggle.map(todo => todo.id);

    setSelectedTodosIds(idsToLoad => [...idsToLoad, ...todosToToggleIds]);

    const requests = todosToToggle
      .map(todo => {
        return TodosApi.updateTodo({
          ...todo,
          completed: hasActiveTodo,
        });
      });

    Promise.all(requests)
      .then(() => {
        setTodos(tasks => tasks.map(task => {
          if (task.completed === hasActiveTodo) {
            return task;
          }

          return { ...task, completed: hasActiveTodo };
        }));
      })
      .catch((err) => {
        setErrorMessage(Errors.updateTodoError);

        return err;
      })
      .finally(() => setSelectedTodosIds(
        idsToLoad => idsToLoad.filter(id => !todosToToggleIds.includes(id)),
      ));
  }, [
    todos,
    hasActiveTodo,
    setTodos,
    setErrorMessage,
    setSelectedTodosIds,
  ]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !hasActiveTodo,
          })}
          onClick={handleToggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={onFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          disabled={isLoading}
          ref={titleField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={onInputChange}
        />
      </form>
    </header>
  );
});
