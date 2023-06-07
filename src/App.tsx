import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  createTodos,
  getTodos,
  removeTodo,
  updateTodos,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { Filter } from './components/Filter/Filter';
import { TodoError } from './components/Notification/TodoError';
import { FilterEnum } from './types/FilterEnum';

const USER_ID = 10640;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState<FilterEnum>(FilterEnum.All);
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodoId, setDeleteTodoId] = useState(0);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  const [editingTodo, setEditingTodo] = useState(0);
  const [loadingTodo, setLoadingTodo] = useState(0);

  const activeTodo = todos.filter(todo => !todo.completed).length;
  const completedTodo = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then((res) => {
        setTodos(res);
      })
      .catch(() => {
        setError('Unable to add a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      });
  }, []);

  const addTodo = (title: string) => {
    if (!title.trim()) {
      setError('Title can`t be empty');
      setTimeout(() => {
        setError('');
      }, 3000);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTodo);
      setIsDisabled(true);
      setError('');

      createTodos(USER_ID, newTodo)
        .then((res) => {
          setTodos((prevTodo) => {
            return [...prevTodo, res];
          });
        })
        .catch(() => {
          setError('Unable to add a todo');

          const timer = setTimeout(() => {
            setError('');
          }, 3000);

          return () => {
            clearTimeout(timer);
          };
        })
        .finally(() => {
          setIsDisabled(false);
          setTempTodo(null);
        });
    }
  };

  const deleteTodo = (id: number) => {
    setDeleteTodoId(id);

    removeTodo(id)
      .then(() => {
        const result = todos.filter(todo => todo.id !== id);

        setTodos(result);
        setError('');
      })
      .catch(() => {
        setError('Unable to delete a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      })
      .finally(() => {
        setDeleteTodoId(null || 0);
      });
  };

  const handleChangeCompleted = (id: number) => {
    const currentItem = todos.find(item => item.id === id);
    const todoTitle = todos.reduce((prev, { title }) => ({ ...prev, title }));
    const todo = {
      id,
      userId: USER_ID,
      title: todoTitle.title,
      completed: false,
    };

    setLoadingTodo(id);

    updateTodos(id, todo)
      .then((data) => {
        const completed = todos.map(item => (
          item.id === id
            ? { ...data, completed: !currentItem?.completed } : item
        ));

        setTodos(completed);
      })
      .catch(() => {
        setError('Unable to update a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      })
      .finally(() => {
        setLoadingTodo(0);
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(item => {
      if (item.completed) {
        setIsLoadingCompleted(true);
        removeTodo(item.id)
          .then(() => {
            const filteredTodos = todos.filter(items => !items.completed);

            setTodos(filteredTodos);
          })
          .catch(() => {
            setError('Unable to delete a todo');

            const timer = setTimeout(() => {
              setError('');
            }, 3000);

            return () => {
              clearTimeout(timer);
            };
          })
          .finally(() => setIsLoadingCompleted(false));
      }
    });
  };

  const handleToggleAll = () => {
    todos.forEach((item) => {
      setIsLoadingCompleted(true);
      updateTodos(item.id, item)
        .then(() => {
          const completed = todos.map(todo => (
            { ...todo, completed: true }
          ));

          const unCompleted = todos.map(todo => (
            { ...todo, completed: false }
          ));

          if (todos.some(todo => !todo.completed)) {
            setTodos(completed);
          } else {
            setTodos(unCompleted);
          }
        })
        .catch(() => {
          setError('Unable to update a todo');

          const timer = setTimeout(() => {
            setError('');
          }, 3000);

          return () => {
            clearTimeout(timer);
          };
        })
        .finally(() => {
          setIsLoadingCompleted(false);
        });
    });
  };

  const updateTitle = (id: number, title: string) => {
    if (title.trim() === '') {
      deleteTodo(id);
    }

    const newTitle = {
      id,
      userId: USER_ID,
      title,
      completed: false,
    };

    setLoadingTodo(id);
    setEditingTodo(0);
    updateTodos(id, newTitle)
      .then(res => {
        const result = todos.map(item => {
          if (item.id === res.id) {
            return { ...item, title };
          }

          return item;
        });

        setTodos(result);
      })
      .catch(() => {
        setError('Unable to update a todo');

        const timer = setTimeout(() => {
          setError('');
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      })
      .finally(() => {
        setLoadingTodo(0);
        setError('');
      });
  };

  const handleDoubleClick = (id: number) => {
    setEditingTodo(id);
  };

  const filteredTodos = useMemo(() => {
    return todos?.filter(todo => {
      switch (filterValue) {
        case FilterEnum.Active:
          return !todo.completed;
        case FilterEnum.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterValue]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          handleToggleAll={handleToggleAll}
          todos={todos}
          addTodo={addTodo}
          isDisabled={isDisabled}
          activeTodo={activeTodo}
        />

        <section className="todoapp__main">
          <TodoList
            todos={filteredTodos}
            handleChangeCompleted={handleChangeCompleted}
            deleteTodo={deleteTodo}
            tempTodo={tempTodo}
            deleteTodoId={deleteTodoId}
            updateTitle={updateTitle}
            handleDoubleClick={handleDoubleClick}
            setEditingTodo={setEditingTodo}
            editingTodo={editingTodo}
            loadingTodo={loadingTodo}
            isLoadingCompleted={isLoadingCompleted}
          />
        </section>
        {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <Filter
              handleFilter={setFilterValue}
              activeFilter={filterValue}
              activeTodo={activeTodo}
              completedTodo={completedTodo}
              onClearCompleted={handleClearCompleted}
            />
          </footer>
        )}
      </div>

      {error && (<TodoError error={error} setError={setError} />) }
    </div>
  );
};
