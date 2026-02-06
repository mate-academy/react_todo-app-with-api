/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { SortType } from './types/sortField';
import { ErrorField } from './types/errorField';
import { AddBar } from './components/AddBar/AddBar';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from './components/ErrorMessage/ErrorNotification';
import { filterItems } from './utils/filterItems';

export const App: React.FC = () => {
  //#region states

  const todoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isChanging, setIsChanging] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [sortField, setSortField] = useState<SortType>(SortType.default);

  const completedCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodosId = todos
    .filter(todo => todo.completed)
    .map(comleteTodo => comleteTodo.id);

  const isHeaderButtonActive = todos.every(todo => todo.completed);
  const isFooterButtonDisabled = !todos.some(todo => todo.completed === true);
  const isToggleButtonVisible = todos.length !== 0;

  //#endregion

  //#region effects
  useEffect(() => {
    getTodos()
      .then(result => {
        setTodos(result);
      })
      .catch(() => {
        setErrorMessage(ErrorField.loadError);
      });
  }, []);

  useEffect(() => {
    todoField.current?.focus();
  }, [todos, errorMessage]);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    setIsErrorVisible(true);

    const timer = setTimeout(() => {
      setIsErrorVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  //#endregion

  //#region error
  const handleErrorClose = () => {
    setIsErrorVisible(false);
    setErrorMessage('');
  };
  //#endregion

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (query.trim() === '') {
      setErrorMessage(ErrorField.emptyTitle);

      return Promise.resolve();
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    if (todoField.current) {
      todoField.current.disabled = true;
    }

    setTempTodo({ ...newTodo, id: 0 });

    return createTodo({ ...newTodo })
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorField.addError);
      })
      .finally(() => {
        setTempTodo(null);
        todoField.current!.disabled = false;
      });
  };

  const handleFilter = (field: SortType) => {
    setSortField(field);
  };

  //#region toggle
  const handleToggle = (todoId: number) => {
    setIsChanging(currSet => {
      const newSet = new Set(currSet);

      newSet.add(todoId);

      return newSet;
    });

    const currentTodo = todos.find(todo => todo.id === todoId);

    return updateTodo(todoId, { completed: !currentTodo?.completed })
      .then(todo => {
        setTodos(prevTodos => {
          return prevTodos.map(prevTodo =>
            prevTodo.id === todo.id ? todo : prevTodo,
          );
        });
      })
      .catch(() => {
        setErrorMessage(ErrorField.updateError);
      })
      .finally(() => {
        setIsChanging(currSet => {
          const newSet = new Set(currSet);

          newSet.delete(todoId);

          return newSet;
        });
      });
  };

  const handleToggleAll = () => {
    const shouldComplete = todos.some(todo => !todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    todosToUpdate.forEach(todo => {
      setIsChanging(currSet => {
        const newSet = new Set(currSet);

        todos.forEach(t => newSet.add(t.id));

        return newSet;
      });

      return updateTodo(todo.id, { completed: shouldComplete })
        .then(updatedTodo => {
          setTodos(currTodos => {
            return currTodos.map(currTodo =>
              currTodo.id === updatedTodo.id ? updatedTodo : currTodo,
            );
          });
        })
        .catch(() => {
          setErrorMessage(ErrorField.updateError);
        })
        .finally(() => {
          setIsChanging(currSet => {
            const newSet = new Set(currSet);

            todos.forEach(t => newSet.delete(t.id));

            return newSet;
          });
        });
    });
  };
  //#endregion

  //#region delete
  const handleDelete = (todoId: number) => {
    setIsChanging(currSet => {
      const newSet = new Set(currSet);

      newSet.add(todoId);

      return newSet;
    });

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorField.deleteError);
        throw error;
      })
      .finally(() => {
        setIsChanging(currSet => {
          const newSet = new Set(currSet);

          newSet.delete(todoId);

          return newSet;
        });
      });
  };

  const handleDeleteCompetedTodos = () => {
    setIsChanging(currSet => {
      const newSet = new Set(currSet);

      completedTodosId.forEach(id => newSet.add(id));

      return newSet;
    });

    const deletePromises = completedTodosId.map(id => deleteTodo(id));

    Promise.allSettled(deletePromises).then(results => {
      const successId = completedTodosId.filter((id, i) => {
        return results[i].status === 'fulfilled';
      });
      const failedId = completedTodosId.filter((id, i) => {
        return results[i].status === 'rejected';
      });

      if (successId.length > 0) {
        setTodos(curr =>
          curr.filter(oldTodo => !successId.includes(oldTodo.id)),
        );
      }

      if (failedId.length > 0) {
        setErrorMessage(ErrorField.deleteError);
      }

      setIsChanging(currSet => {
        const newSet = new Set(currSet);

        completedTodosId.forEach(id => newSet.delete(id));

        return newSet;
      });
    });
  };
  //#endregion

  //#region edit
  const handleUpdate = (todoId: number, newTitle: string) => {
    const currentTodo = todos.find(todo => todo.id === todoId);

    if (!currentTodo) {
      return Promise.resolve();
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === currentTodo.title) {
      return Promise.resolve();
    }

    if (!trimmedTitle) {
      return handleDelete(todoId);
    }

    setIsChanging(currSet => {
      const newSet = new Set(currSet);

      newSet.add(todoId);

      return newSet;
    });

    return updateTodo(todoId, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(prevTodo =>
            prevTodo.id === todoId ? updatedTodo : prevTodo,
          ),
        );
      })
      .catch(err => {
        setErrorMessage(ErrorField.updateError);
        throw err;
      })
      .finally(() => {
        setIsChanging(currSet => {
          const newSet = new Set(currSet);

          newSet.delete(todoId);

          return newSet;
        });
      });
  };
  // #endregion

  const visibleTodos = useMemo(() => {
    const copyTodos = [...todos];

    switch (sortField) {
      case SortType.active:
        return copyTodos.filter(todo => !todo.completed);
      case SortType.completed:
        return copyTodos.filter(todo => todo.completed);
      case SortType.default:
      default:
        return copyTodos;
    }
  }, [todos, sortField]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddBar
          todoField={todoField}
          query={query}
          isActive={isHeaderButtonActive}
          isVisible={isToggleButtonVisible}
          onToggleAll={handleToggleAll}
          onSubmit={handleSubmit}
          setQuery={setQuery}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          isChanging={isChanging}
          onDelete={handleDelete}
          onToogle={handleToggle}
          onUpdate={handleUpdate}
        />

        {todos.length > 0 && (
          <Footer
            count={completedCount}
            isDisabled={isFooterButtonDisabled}
            sortField={sortField}
            filterItems={filterItems}
            onDelete={handleDeleteCompetedTodos}
            onFilter={handleFilter}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        isVisible={isErrorVisible}
        onClose={handleErrorClose}
      />
    </div>
  );
};
