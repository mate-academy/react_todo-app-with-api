import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './api/todoApi';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer, FilterOptions } from './components/Footer';
import { Todo } from './components/TodoItem';
import classNames from 'classnames';

const USER_ID = 2311;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterOptions>(FilterOptions.All);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [batchUpdatingIds, setBatchUpdatingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        const todosData = await fetchTodos(USER_ID);

        setTodos(todosData);
      } catch (error) {
        setErrorMessage('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (newTodo.trim() === '') {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [newTodo]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setNewTitle(todo.title);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleSaveTitle = async (id: number) => {
    if (newTitle.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    const existingTodo = todos.find(todo => {
      return todo.id === id;
    });

    if (!existingTodo) {
      return;
    }

    if (newTitle.trim() === existingTodo.title) {
      setEditingTodoId(null);
      setNewTitle('');

      return;
    }

    setUpdatingTodoId(id);
    setLoading(true);
    try {
      const updatedTodo = await updateTodo(id, {
        title: newTitle,
        completed: existingTodo.completed,
      });

      setTodos(
        todos.map(todo => {
          if (todo.id === id) {
            return updatedTodo;
          } else {
            return todo;
          }
        }),
      );
      setEditingTodoId(null);
      setNewTitle('');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoading(false);
      setUpdatingTodoId(null);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNewTodo(event.target.value);
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodo.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    const tempTodoData: Todo = {
      id: Date.now(),
      title: newTodo,
      completed: false,
    };

    setTempTodo(tempTodoData);
    setIsAdding(true);
    setIsInputDisabled(true);
    try {
      const newTodoData = await addTodo({ title: newTodo, userId: USER_ID });

      setTodos([...todos, newTodoData]);
      setNewTodo('');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setIsAdding(false);
      setIsInputDisabled(false);
      setTempTodo(null);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleToggleTodo = async (id: number) => {
    const todoToUpdate = todos.find(todo => {
      return todo.id === id;
    });

    if (!todoToUpdate) {
      return;
    }

    const newCompleted = !todoToUpdate.completed;

    setUpdatingTodoId(id);
    try {
      const updatedTodo = await updateTodo(id, {
        title: todoToUpdate.title,
        completed: newCompleted,
      });

      setTodos(
        todos.map(todo => {
          if (todo.id === id) {
            return updatedTodo;
          } else {
            return todo;
          }
        }),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingTodoId(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setDeletingTodoIds(prev => {
      return [...prev, id];
    });
    try {
      await deleteTodo(id);
      setTodos(prev => {
        return prev.filter(todo => {
          return todo.id !== id;
        });
      });
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletingTodoIds(prev => {
        return prev.filter(todoId => {
          return todoId !== id;
        });
      });
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => {
      return todo.completed;
    });

    setDeletingTodoIds(
      completedTodos.map(todo => {
        return todo.id;
      }),
    );
    try {
      await Promise.all(
        completedTodos.map(todo => {
          return deleteTodo(todo.id);
        }),
      );
      setTodos(
        todos.filter(todo => {
          return !todo.completed;
        }),
      );
    } catch (error) {
      setErrorMessage('Unable to clear completed todos');
    } finally {
      setDeletingTodoIds([]);
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => {
      return todo.completed;
    });
    const todosToUpdate = todos.filter(todo => {
      return todo.completed === allCompleted;
    });

    setBatchUpdatingIds(
      todosToUpdate.map(todo => {
        return todo.id;
      }),
    );
    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo => {
          return updateTodo(todo.id, {
            title: todo.title,
            completed: !allCompleted,
          });
        }),
      );
      const updatedMap = new Map(
        updatedTodos.map(t => {
          return [t.id, t];
        }),
      );

      setTodos(
        todos.map(todo => {
          if (updatedMap.has(todo.id)) {
            return updatedMap.get(todo.id)!;
          } else {
            return todo;
          }
        }),
      );
    } catch (error) {
      setErrorMessage('Unable to toggle all todos');
    } finally {
      setBatchUpdatingIds([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterOptions.Active) {
      return !todo.completed;
    }

    if (filter === FilterOptions.Completed) {
      return todo.completed;
    }

    return true;
  });

  if (
    tempTodo &&
    (filter === FilterOptions.All || filter === FilterOptions.Active)
  ) {
    filteredTodos.push(tempTodo);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodo={newTodo}
          isInputDisabled={isInputDisabled}
          onTodoChange={handleNewTodoChange}
          onAddTodo={handleAddTodo}
          inputRef={inputRef}
          onToggleAll={handleToggleAll}
          isAdding={isAdding}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          loading={loading}
          deletingTodoIds={deletingTodoIds}
          updatingTodoId={updatingTodoId}
          batchUpdatingIds={batchUpdatingIds}
          editing={{
            editingTodoId: editingTodoId,
            newTitle: newTitle,
            inputRef: inputRef,
          }}
          handlers={{
            onToggleTodo: handleToggleTodo,
            onEditTodo: handleEditTodo,
            onDeleteTodo: handleDeleteTodo,
            onSaveTitle: handleSaveTitle,
            onChangeNewTitle: e => {
              setNewTitle(e.target.value);
            },
          }}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        {errorMessage}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setErrorMessage(null);
          }}
        ></button>
      </div>
    </div>
  );
};
