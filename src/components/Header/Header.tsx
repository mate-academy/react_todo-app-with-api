import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import * as todoSevice from '../../api/todos';
import { Errors } from '../../types/Errors';
import { handleRequestError } from '../../utils/handleRequestError';
import { useTodosContext } from '../../utils/useTodosContext';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    setTempTodo,
    setError,
    setLoadingTodoIds,
    activeTodos,
    completedTodos,
    isFocused,
    // isEdit,
    setIsFocused,
  } = useTodosContext();
  const addTodoInputRef = useRef<HTMLInputElement>(null);
  const isClassActive = completedTodos.length > 0 && activeTodos.length === 0;
  const [title, setTitle] = useState('');
  const [isSubMit, setIsSubmit] = useState(false);
  const isAllSelected = todos.every(todo => todo.completed);

  useEffect(() => {
    if (isFocused && addTodoInputRef.current) {
      addTodoInputRef.current.focus();
      setIsFocused(false);
    }
  }, [isFocused, setIsFocused]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(Errors.default);
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmit(true);

    if (!title.trim().length) {
      handleRequestError(Errors.emptyTitle, setError);
      setIsSubmit(false);
    } else {
      const newTodo = {
        title: title.trim(),
        userId: todoSevice.USER_ID,
        completed: false,
      };

      const tempTodo = {
        id: 0,
        ...newTodo,
      };

      setTempTodo(tempTodo);
      setLoadingTodoIds(prevLoadingTodoIds => [
        ...prevLoadingTodoIds,
        tempTodo.id,
      ]);
      todoSevice
        .createTodo(newTodo)
        .then((response: Todo) => {
          setTodos((prevTodos: Todo[]) => [...prevTodos, response]);
          setTitle('');
          setIsFocused(true);
        })
        .catch(() => {
          handleRequestError(Errors.addTodo, setError);
        })
        .finally(() => {
          setIsSubmit(false);
          setTempTodo(null);
          setIsFocused(true);
          setLoadingTodoIds(prevLoadingTodoIds =>
            prevLoadingTodoIds.filter(id => id !== tempTodo.id),
          );
        });
    }
  };

  const handleCompletedAllTodos = (todoId: number, completed: boolean) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    setIsFocused(false);
    todoSevice
      .updateTodo(todoId, { completed: completed })
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(prevTodo => {
            return prevTodo.id === todoId
              ? { ...prevTodo, completed: completed }
              : prevTodo;
          }),
        );
      })
      .catch(error => {
        handleRequestError(Errors.updateTodo, setError);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  const handleToggleAll = () => {
    if (isAllSelected) {
      todos.forEach(todo => {
        handleCompletedAllTodos(todo.id, !todo.completed);
      });
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          handleCompletedAllTodos(todo.id, true);
        }
      });
    }
  };

  return (
    <div>
      <header className="todoapp__header">
        {todos.length !== 0 && (
          <button
            type="button"
            onClick={handleToggleAll}
            className={cn('todoapp__toggle-all', {
              active: isClassActive,
            })}
            data-cy="ToggleAllButton"
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={handleInputChange}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={addTodoInputRef}
            disabled={isSubMit}
          />
        </form>
      </header>
    </div>
  );
};
