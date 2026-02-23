import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  USER_ID,
  updateTodo,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';

type FilterStatus = 'all' | 'active' | 'completed';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const startTodoLoading = (id: number) => {
    setLoadingTodoIds(current => [...current, id]);
  };

  const stopTodoLoading = (id: number) => {
    setLoadingTodoIds(current => current.filter(todoId => todoId !== id));
  };

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
  };

  const handleDeleteTodo = (id: number) => {
    setErrorMessage('');
    startTodoLoading(id);

    return deleteTodo(id)
      .then(() => setTodos(current => current.filter(todo => todo.id !== id)))
      .catch(() => {
        showError(ErrorMessage.DELETE_TODO);
      })
      .finally(() => {
        stopTodoLoading(id);
        setTimeout(() => {
          newTodoInputRef.current?.focus();
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    setErrorMessage('');

    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (!completedIds.length) {
      return;
    }

    setLoadingTodoIds(current => [...current, ...completedIds]);

    Promise.allSettled(completedIds.map(id => deleteTodo(id))).then(results => {
      const successfulIds = completedIds.filter(
        (_, index) => results[index].status === 'fulfilled',
      );
      const hasFailed = results.some(result => result.status === 'rejected');

      if (successfulIds.length) {
        setTodos(current =>
          current.filter(todo => !successfulIds.includes(todo.id)),
        );
      }

      if (hasFailed) {
        showError(ErrorMessage.DELETE_TODO);
      }

      setLoadingTodoIds(current =>
        current.filter(id => !completedIds.includes(id)),
      );

      setTimeout(() => {
        newTodoInputRef.current?.focus();
      }, 0);
    });
  };

  const handleToggleTodo = (todo: Todo) => {
    startTodoLoading(todo.id);
    setErrorMessage('');

    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(item => (item.id === todo.id ? updatedTodo : item)),
        );
      })
      .catch(() => showError(ErrorMessage.UPDATE_TODO))
      .finally(() => {
        stopTodoLoading(todo.id);
      });
  };

  const handleToggleAll = () => {
    setErrorMessage('');

    const targetCompleted = todos.some(todo => !todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== targetCompleted,
    );

    if (!todosToUpdate.length) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingTodoIds(current => [...current, ...idsToUpdate]);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: targetCompleted }),
      ),
    ).then(results => {
      const updatedTodos: Todo[] = [];

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          updatedTodos.push(result.value);
        }
      });

      if (updatedTodos.length) {
        setTodos(current =>
          current.map(todo => {
            const updated = updatedTodos.find(item => item.id === todo.id);

            return updated || todo;
          }),
        );
      }

      if (results.some(result => result.status === 'rejected')) {
        showError(ErrorMessage.UPDATE_TODO);
      }

      setLoadingTodoIds(current =>
        current.filter(id => !idsToUpdate.includes(id)),
      );
    });
  };

  const handleRenameTodo = (todo: Todo, title: string): Promise<void> => {
    const trimmed = title.trim();

    if (trimmed === todo.title) {
      return Promise.resolve();
    }

    if (trimmed === '') {
      setErrorMessage('');
      startTodoLoading(todo.id);

      return deleteTodo(todo.id)
        .then(() =>
          setTodos(current => current.filter(item => item.id !== todo.id)),
        )
        .catch(() => {
          showError(ErrorMessage.DELETE_TODO);
          throw new Error(ErrorMessage.DELETE_TODO); // ← тримає форму відкритою
        })
        .finally(() => {
          stopTodoLoading(todo.id);
          setTimeout(() => {
            newTodoInputRef.current?.focus();
          }, 0);
        });
    }

    setErrorMessage('');
    startTodoLoading(todo.id);

    return updateTodo(todo.id, { title: trimmed })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(item => (item.id === todo.id ? updatedTodo : item)),
        );
      })
      .catch(() => {
        showError(ErrorMessage.UPDATE_TODO);
        throw new Error(ErrorMessage.UPDATE_TODO);
      })
      .finally(() => {
        stopTodoLoading(todo.id);
      });
  };

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.EMPTY_TITLE);

      return;
    }

    setErrorMessage('');
    setIsAdding(true);

    const newTodoData = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodoData });

    addTodo(newTodoData)
      .then(createdTodo => {
        setTodos(current => [...current, createdTodo]);
        setNewTitle('');
      })
      .catch(() => showError(ErrorMessage.ADD_TODO))
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        setTimeout(() => {
          newTodoInputRef.current?.focus();
        }, 0);
      });
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const closeError = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    newTodoInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LOAD_TODOS))
      .finally(() => setIsLoading(false));
  }, []);

  return {
    todos,
    isLoading,
    isAdding,
    errorMessage,
    filter,
    newTitle,
    tempTodo,
    loadingTodoIds,
    newTodoInputRef,
    visibleTodos,
    setFilter,
    setNewTitle,
    closeError,
    handleAddTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleToggleAll,
    handleClearCompleted,
    handleRenameTodo,
  };
};
