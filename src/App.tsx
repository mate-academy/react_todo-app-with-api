/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import { useRef, createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterBy, setFilterBy] = useState<FilterStatus>('all');

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [toggleAllVisible, setToggleAllVisible] = useState(false);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const tempTodoNodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newTodoFieldRef.current && !isCreating) {
      newTodoFieldRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    getTodos()
      .then(initialTodos => {
        setTodos(initialTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setToggleAllVisible(true);
      });
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

  // filtra por active, completed, all (default)
  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
    // [todos]: Recalcula apenas quando todos muda.
    // []: Calcula apenas uma vez (mount)
    // Sem array: Calcula a cada render. Não usar
  }, [todos]);

  const allTodosCompleted = useMemo(() => {
    return todos.length > 0 && todos.every(todo => todo.completed);
  }, [todos]);

  // adiciona o id para o array processingIds
  const addProcessingId = (id: number) => {
    setProcessingIds(prev => [...prev, id]);
  };

  // remove o id do array processingIds
  const removeProcessingId = (id: number) => {
    setProcessingIds(prev => prev.filter(processId => processId !== id));
  };

  const handleFilterChange = (status: FilterStatus) => {
    setFilterBy(status);
  };

  const focusNewTodoField = () => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  };

  const handleToggleTodo = (todoId: number) => {
    const todoToUpdate = todos.find(t => t.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    addProcessingId(todoId);

    updateTodo(todoId, { completed: !todoToUpdate.completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === todoId ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => removeProcessingId(todoId));
  };

  const handleAddTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsCreating(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });

    addTodo(trimmedTitle)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setNewTodoTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsCreating(false);
        focusNewTodoField();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    addProcessingId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        removeProcessingId(todoId);
        focusNewTodoField();
      });
  };

  const handleDeleteCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...completedIds]);

    // O método map() itera sobre cada id no array completedIds
    Promise.allSettled(completedIds.map(id => deleteTodo(id)))
      // .then() é executado somente depois que todas as Promises no array forem resolvidas (seja com sucesso ou falha)
      .then(results => {
        // Separa os IDs que deram certo dos que falharam
        const successfulIds: number[] = [];
        let isRejected = false;

        // verifica cada resultado se é 'fulfilled' ou 'rejected'
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulIds.push(completedIds[index]);
          } else {
            isRejected = true;
          }
        });

        // Remove apenas os que deram certo
        if (successfulIds.length > 0) {
          setTodos(currentTodos =>
            currentTodos.filter(todo => !successfulIds.includes(todo.id)),
          );
        }

        // Mostra erro se algum foi rejeitado
        if (isRejected) {
          setErrorMessage('Unable to delete a todo');
        }
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => !completedIds.includes(id)));
        focusNewTodoField();
      });
  };

  const toggleAllSelectAll = () => {
    // allTodosCompleted retorna true / false
    // o operador de negação define o contrario do retorno
    // se todos estao marcados statusToApply será false e todos serao desmarcados
    // se nem todos estao marcados statusToApply será true e todos serao marcados
    const statusToApply = !allTodosCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== statusToApply,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...idsToUpdate]);

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: statusToApply }),
    );

    Promise.allSettled(updatePromises)
      .then(results => {
        const successfullyUpdatedTodos: Todo[] = [];
        let hasErrors = false;

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            successfullyUpdatedTodos.push(result.value);
          } else {
            hasErrors = true;
          }
        });

        setTodos(currentTodos =>
          currentTodos.map(
            t => successfullyUpdatedTodos.find(ut => ut.id === t.id) || t,
          ),
        );

        if (hasErrors) {
          setErrorMessage('Unable to update a todo');
        }
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
        focusNewTodoField();
      });
  };

  const handleUpdateTodo = async (
    todoId: number,
    updates: Partial<Todo>,
  ): Promise<void> => {
    addProcessingId(todoId);

    try {
      const updatedTodo = await updateTodo(todoId, updates);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    } finally {
      removeProcessingId(todoId);
      focusNewTodoField();
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {toggleAllVisible && todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={toggleAllSelectAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddTodo(newTodoTitle);
            }}
          >
            <input
              ref={newTodoFieldRef}
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isCreating}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => {
              const nodeRef = createRef<HTMLDivElement>();

              return (
                <CSSTransition
                  key={todo.id}
                  nodeRef={nodeRef}
                  timeout={300}
                  classNames="item"
                >
                  <div ref={nodeRef}>
                    <TodoItem
                      todo={todo}
                      onToggle={handleToggleTodo}
                      onDelete={handleDeleteTodo}
                      onUpdate={handleUpdateTodo}
                      isLoading={processingIds.includes(todo.id)}
                    />
                  </div>
                </CSSTransition>
              );
            })}

            {isCreating && tempTodo && (
              <CSSTransition
                key="temp-todo"
                nodeRef={tempTodoNodeRef}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem
                  todo={tempTodo}
                  onToggle={() => {}}
                  onDelete={() => {}}
                  onUpdate={async () => {}}
                  isLoading={true}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filterBy === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={e => {
                  e.preventDefault();
                  handleFilterChange('all');
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filterBy === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={e => {
                  e.preventDefault();
                  handleFilterChange('active');
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filterBy === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={e => {
                  e.preventDefault();
                  handleFilterChange('completed');
                }}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteCompleted}
              disabled={todos.every(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`
          notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}
          `}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
