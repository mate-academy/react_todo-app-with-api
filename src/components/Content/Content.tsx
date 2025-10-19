import { useEffect, useMemo, useState } from 'react';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { Main } from '../Main';
import { Todo } from '../../types/Todo';
import { ErrorCode } from '../../types/ErrorCode';
import * as todoService from '../../api/todos';
import { Filters } from '../../types/Filters';

type Props = {
  onShowError: (errorCode: Exclude<ErrorCode, null>) => void;
  onClearError: () => void;
};
//#region functions
function getPreparedTodos(
  currentTodos: Todo[],
  active: Todo[],
  completed: Todo[],
  filter: Filters,
): Todo[] {
  let preparedTodos: Todo[] = [];

  switch (filter) {
    case Filters.Active:
      preparedTodos = active;
      break;

    case Filters.Completed:
      preparedTodos = completed;
      break;

    case Filters.All:
    default:
      preparedTodos = [...currentTodos];
  }

  return preparedTodos;
}

function wait(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}
//#endregion

export const Content: React.FC<Props> = ({ onShowError, onClearError }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [currentFilter, setCurrentFilter] = useState<Filters>(Filters.All);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [focusSignal, setFocusSignal] = useState(0);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => onShowError('load_failed'));
  }, [onShowError]);

  //#region variables
  const todosActive: Todo[] = useMemo(
    () => todos.filter(todo => todo.completed === false),
    [todos],
  );
  const todosCompleted: Todo[] = useMemo(
    () => todos.filter(todo => todo.completed === true),
    [todos],
  );

  const activeIds = todosActive.map(todo => todo.id);
  const completedIds = todosCompleted.map(todo => todo.id);
  //#endregion

  //#region Update Handlers, Add, Delete fuctions
  const handleStatusUpdate = (id: number, completed: boolean) => {
    const previousTodos = todos;

    setUpdatingIds(prev => [...prev, id]);

    todoService
      .updateTodoStatus({ id, completed }) // .updateTodoStatus(id, completed) - коли передаємо не деструктурований обʼєкт
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, completed: completed } : todo,
          ),
        );

        return wait(200);
      })
      .catch(() => {
        // якщо помилка — повертаємо попередній стан і показуємо помилку
        setTodos(previousTodos);
        onShowError('update_failed');

        setTimeout(() => {
          onClearError();
        }, 3000);
      })
      .finally(() => {
        setUpdatingIds([]);
      });
  };

  const handleTodoTitleUpdate = (id: number, title: string) => {
    const previousTodos = [...todos];

    setUpdatingIds(prev => [...prev, id]);

    return todoService
      .updateTodoTitle({ id, title })
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, title: title } : todo,
          ),
        );

        return wait(200);
      })
      .catch(error => {
        setTodos(previousTodos);
        onShowError('update_failed');

        setTimeout(() => {
          onClearError();
        }, 3000);

        throw error;
      })
      .finally(() => {
        setUpdatingIds([]);
      });
  };

  const handleFilterUpdate = (filter: Filters) => {
    setCurrentFilter(filter);
  };

  const handleToggleAllButton = () => {
    if (activeIds.length > 0) {
      setUpdatingIds(prev => [...prev, ...activeIds]);

      return Promise.allSettled(
        activeIds.map(id =>
          todoService
            .updateTodoStatus({ id, completed: true })
            .then(() => wait(200))
            .then(() => {
              setTodos(currentTodos =>
                currentTodos.map(todo => {
                  if (activeIds.includes(todo.id)) {
                    return {
                      ...todo,
                      completed: true,
                    };
                  }

                  return todo;
                }),
              );
            })
            .catch(() => {
              onShowError('update_failed');

              setTimeout(() => {
                onClearError();
              }, 3000);
            })
            .finally(() => {
              setUpdatingIds([]);
            }),
        ),
      );
    } else {
      setUpdatingIds(prev => [...prev, ...completedIds]);

      return Promise.allSettled(
        completedIds.map(id =>
          todoService
            .updateTodoStatus({ id, completed: false })
            .then(() => wait(200))
            .then(() => {
              setTodos(currentTodos =>
                currentTodos.map(todo => {
                  if (completedIds.includes(todo.id)) {
                    return {
                      ...todo,
                      completed: false,
                    };
                  }

                  return todo;
                }),
              );
            })
            .catch(() => {
              onShowError('update_failed');

              setTimeout(() => {
                onClearError();
              }, 3000);
            })
            .finally(() => {
              setUpdatingIds([]);
            }),
        ),
      );
    }
  };

  const addTodo = (title: string) => {
    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: todoService.USER_ID,
    });

    return todoService
      .addTodo(title)
      .then(newTodo => {
        return wait(200).then(() => {
          setTodos(prev => [...prev, newTodo]);
        });
      })
      .catch(error => {
        onShowError('add_failed');
        setTimeout(() => {
          onClearError();
        }, 3000);

        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setUpdatingIds(prev => [...prev, todoId]);

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        return wait(200);
      })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setFocusSignal(prev => prev + 1);
      })
      .catch(error => {
        // setTodos(todos);
        onShowError('delete_failed');
        setTimeout(() => {
          onClearError();
        }, 3000);

        throw error;
      })
      .finally(() => {
        setUpdatingIds([]);
      });
  };

  const clearCompletedTodo = () => {
    setDeletingIds(prev => [...prev, ...completedIds]);

    return Promise.allSettled(
      completedIds.map(completedId =>
        todoService
          .deleteTodo(completedId)
          .then(() => wait(200))
          .then(() => {
            // прибрати з масиву по успіху
            setTodos(prev => prev.filter(todo => todo.id !== completedId));
          })
          .catch(() => {
            onShowError('delete_failed');
            setTimeout(onClearError, 3000);
          })
          .finally(() => {
            setDeletingIds(prev =>
              prev.filter(todoId => todoId !== completedId),
            );
          }),
      ),
    ).finally(() => {
      setFocusSignal(prev => prev + 1);
    });
  };
  //#endregion

  const visibleTodos = useMemo(
    () => getPreparedTodos(todos, todosActive, todosCompleted, currentFilter),
    [todos, todosActive, todosCompleted, currentFilter],
  );

  return (
    <div className="todoapp__content">
      <Header
        focusSignal={focusSignal}
        todos={todos}
        onToggleAllButton={handleToggleAllButton}
        onShowError={onShowError}
        onClearError={onClearError}
        onSubmit={addTodo}
      />
      <Main
        tempTodo={tempTodo}
        todos={visibleTodos}
        updatingIds={updatingIds}
        onShowError={onShowError}
        onClearError={onClearError}
        onStatusUpdate={handleStatusUpdate}
        TodoDeleteButton={deleteTodo}
        deletingIds={deletingIds}
        onTitleUpdate={handleTodoTitleUpdate}
      />
      {/* Hide the footer if there are no todos */}
      {todos.length !== 0 && (
        <Footer
          onClearCompleted={clearCompletedTodo}
          currentFilter={currentFilter}
          todosActive={todosActive}
          todosCompleted={todosCompleted}
          onFilterChange={handleFilterUpdate}
        />
      )}
    </div>
  );
};
