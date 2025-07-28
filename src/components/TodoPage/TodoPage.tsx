import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoList } from '../TodoList';
import {
  addTodos,
  getTodos,
  updateTodos,
  USER_ID,
  deleteTodos,
} from '../../api/todos';
import { TodoHeader } from '../TodoHeader';
import { TodoFooter } from '../TodoFooter';
import { ErrorNotification } from '../ErrorNotification';
import { Filter } from '../../types/Filter';
import { TodoItem } from '../TodoItem';

export const TodoPage: React.FC = () => {
  const [titleMessage, setTitleMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const inputFocus = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [deletingAllTodo, setDeletingAllTodo] = useState<number[] | null>(null);
  const [loadingAllTodo, setLoadingAllTodo] = useState<number[] | null>(null);

  const loadTodos = () => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  };

  useEffect(loadTodos, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    inputFocus.current?.focus();
  }, [isLoading, deletingTodoId, deletingAllTodo]);

  const addTodo = ({ title, completed }: Todo) => {
    setErrorMessage('');

    return addTodos({ title, completed });
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 4000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleMessage(event.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!titleMessage.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const temp: Todo = {
      id: 0,
      title: titleMessage.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);

    addTodo(temp)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTitleMessage('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };

  const handleFilterChange = (currentfilter: Filter) => {
    setFilter(currentfilter);
  };

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (filter === Filter.Active) {
      result = result.filter(todo => !todo.completed);
    } else if (filter === Filter.Completed) {
      result = result.filter(todo => todo.completed);
    }

    return result;
  }, [todos, filter]);

  const cleanErrorMessage = () => {
    setErrorMessage('');
  };

  const deleteTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    return deleteTodos(todoId)
      .then(() => {
        setTodos(currentPosts =>
          currentPosts.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setTimeout(() => {
          setDeletingTodoId(null);
        }, 500);
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setDeletingAllTodo(completedIds);
    setIsLoading(true);

    const errors: number[] = [];

    for (const todo of completedTodos) {
      try {
        await deleteTodos(todo.id);
      } catch {
        errors.push(todo.id);
      }
    }

    if (errors.length > 0) {
      setErrorMessage('Unable to delete a todo');
    }

    setTodos(currentTodos =>
      currentTodos.filter(todo => !todo.completed || errors.includes(todo.id)),
    );

    setTimeout(() => {
      setDeletingAllTodo(null);
      setIsLoading(false);
    }, 500);
  };

  const toggleTodo = (todoToUpdate: Todo) => {
    setErrorMessage('');

    setLoadingTodoId(todoToUpdate.id);

    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    return updateTodos(updatedTodo)
      .then(newTodo => {
        setTodos(currentTodo => {
          return currentTodo.map(tod =>
            tod.id === newTodo.id ? newTodo : tod,
          );
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingTodoId(null);
        }, 500);
      });
  };

  const toggleAllTodos = () => {
    setErrorMessage('');

    const shouldCompleteAll = !todos.every(tod => tod.completed);

    const todosToUpdate = todos
      .filter(tod => tod.completed !== shouldCompleteAll)
      .map(tod => ({
        ...tod,
        completed: shouldCompleteAll,
      }));

    const loadingIds = todosToUpdate.map(tod => tod.id);

    setLoadingAllTodo(loadingIds);

    Promise.all(todosToUpdate.map(tod => updateTodos(tod)))
      .then(newTodos => {
        setTodos(currentTodos =>
          currentTodos.map(
            tod => newTodos.find(updated => updated.id === tod.id) || tod,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingAllTodo(null);
        }, 500);
      });
  };

  const handleEditSubmit = async (
    id: number,
    oldTitle: string,
    newTitle: string,
  ) => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      try {
        await deleteTodo(id);
      } catch {
        setErrorMessage('Unable to update a todo');
      }

      return;
    }

    if (trimmedTitle !== oldTitle) {
      setLoadingTodoId(id);

      const todoToUpdate = todos.find(todo => todo.id === id);

      if (!todoToUpdate) {
        setErrorMessage('Unable to update a todo');

        throw new Error();
      }

      return updateTodos({ ...todoToUpdate, title: trimmedTitle })
        .then(updatedTodo => {
          setTodos(currentTodos =>
            currentTodos.map(todo =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            ),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          throw new Error();
        })
        .finally(() => {
          setTimeout(() => {
            setLoadingTodoId(null);
          }, 500);
        });
    }
  };

  return (
    <>
      <div className="todoapp__content">
        <TodoHeader
          onSubmit={handleSubmit}
          onTitleChange={handleTitleChange}
          title={titleMessage}
          isDisabled={isLoading}
          inputRef={inputFocus}
          todos={todos}
          toggleAllTodos={toggleAllTodos}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            toggleTodo={toggleTodo}
            onDeleted={deleteTodo}
            deletingTodoId={deletingTodoId}
            deletingAllTodo={deletingAllTodo}
            onEditSubmit={handleEditSubmit}
            loadingTodoId={loadingTodoId}
            loadingAllTodo={loadingAllTodo}
          />
        )}

        {tempTodo && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoItem
              todo={tempTodo}
              onToggle={() => {}}
              isLoading
              onDeleted={() => deleteTodo(tempTodo.id)}
              onEditSubmit={handleEditSubmit}
            />
          </section>
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filter={filter}
            onFilterChange={handleFilterChange}
            onDeletedCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onCleaning={cleanErrorMessage}
      />
    </>
  );
};
