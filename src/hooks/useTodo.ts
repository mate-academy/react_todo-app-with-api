import { useEffect, useState } from 'react';
import {
  getTodos,
  addTodo,
  removeTodo,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

function getFilteredTodos(todos: Todo[], filter: Filter) {
  switch (filter) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);
    case Filter.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tmpTodo, setTmpTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USER_ID]);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timerId = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const visibleTodos = getFilteredTodos(todos, filter);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const createTodo = (title: string) => {
    const data = {
      userId: USER_ID,
      title: title,
      completed: false,
    };

    setTmpTodo({ ...data, id: 0 });

    return addTodo(data)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');

        return false;
      })
      .finally(() => setTmpTodo(null));
  };

  const deleteTodo = (todoId: number): Promise<boolean> => {
    setLoadingIds(current => [...current, todoId]);

    return removeTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');

        return false;
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todoId));
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    return Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
  };

  const changeTodoStatus = (todoId: number): Promise<boolean> => {
    setLoadingIds(current => [...current, todoId]);

    const currentTodo = todos.find(item => item.id === todoId);

    if (!currentTodo) {
      setErrorMessage('Unable to update a todo');

      return Promise.resolve(false);
    }

    const newValue = !currentTodo.completed;

    return updateTodo(todoId, { completed: newValue })
      .then(() => {
        setTodos(current =>
          current.map(todo =>
            todo.id === todoId ? { ...todo, completed: newValue } : todo,
          ),
        );

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        return false;
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todoId));
      });
  };

  const toggleAll = () => {
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);
    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingIds(current => [...current, ...idsToUpdate]);

    return Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: newStatus }).then(updatedTodo => {
          setTodos(current =>
            current.map(item => (item.id === todo.id ? updatedTodo : item)),
          );
        }),
      ),
    ).then(results => {
      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage('Unable to update a todo');
      }

      setLoadingIds(current => current.filter(id => !idsToUpdate.includes(id)));
    });
  };

  const changeTodoTitle = (todoId: number, title: string) => {
    setLoadingIds(current => [...current, todoId]);

    const currentTodo = todos.find(item => item.id === todoId);

    if (!currentTodo) {
      setErrorMessage('Unable to update a todo');

      return Promise.resolve(false);
    }

    return updateTodo(todoId, { title: title })
      .then(() => {
        setTodos(current =>
          current.map(todo =>
            todo.id === todoId ? { ...todo, title: title } : todo,
          ),
        );

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        return false;
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todoId));
      });
  };

  return {
    todos,
    visibleTodos,
    activeCount,
    hasCompleted,
    allCompleted,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    createTodo,
    tmpTodo,
    deleteTodo,
    loadingIds,
    clearCompleted,
    changeTodoStatus,
    toggleAll,
    changeTodoTitle,
  };
};
