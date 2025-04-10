import React, { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorMessage, Filterby, Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { ErrorModal } from './components/ErrorModal/ErrorModal';

const filter = (todos: Todo[], filterBy: Filterby) => {
  switch (filterBy) {
    case Filterby.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case Filterby.COMPLETED:
      return todos.filter(todo => todo.completed);
    case Filterby.ALL:
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(ErrorMessage.NONE);
  const [filterBy, setFilterBy] = useState(Filterby.ALL);
  const [newTitle, setNewTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setError(ErrorMessage.LOAD);
      });
  }, []);

  const filteredTodos = filter(todos, filterBy);

  function handleAddTodo({ id, title, userId, completed }: Todo) {
    if (!newTitle.trim()) {
      setError(ErrorMessage.EMPTY);

      return;
    }

    setLoading(true);

    setTempTodo({ id, title, userId, completed });
    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    return addTodo({ title, userId, completed })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
        setTimeout(() => {
          (inputRef.current as HTMLInputElement).disabled = false;
          inputRef.current?.focus();
        }, 0);
      })
      .catch(() => {
        setError(ErrorMessage.ADD);
        setNewTitle(newTitle);
        (inputRef.current as HTMLInputElement).disabled = false;
        inputRef.current?.focus();
      })
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  }

  function handleDeleteTodo(id: number) {
    setLoadingTodo(currentIds => [...currentIds, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      })
      .catch(() => {
        setError(ErrorMessage.DELETE);
        inputRef.current?.focus();
      })
      .finally(() => {
        setLoadingTodo(prev => prev.filter(prevId => prevId !== id));
      });
  }

  function handleDeleteComplited() {
    const complitedTodo = todos.filter(todo => todo.completed);
    const idsDelete = complitedTodo.map(todo => todo.id);

    if (complitedTodo.length === 0) {
      return;
    }

    setLoadingTodo(idsDelete);

    complitedTodo.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
          inputRef.current?.focus();
        })
        .catch(() => {
          setError(ErrorMessage.DELETE);
          inputRef.current?.focus();
        })
        .finally(() => {
          setLoadingTodo([]);
        });
    });
  }

  function handleToggleTodo(todo: Todo) {
    setLoadingTodo(prev => [...prev, todo.id]);

    return updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo =>
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        ),
      )
      .catch(() => {
        setError(ErrorMessage.UPDATE);
      })
      .finally(() => {
        setLoadingTodo(prev => prev.filter(id => id !== todo.id));
      });
  }

  function handleTaggleAll() {
    const allCompleted = todos.every(todo => todo.completed);

    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingTodo(todosToUpdate.map(todo => todo.id));

    Promise.all(
      todosToUpdate.map(todo => {
        return updateTodo(todo.id, { completed: newStatus })
          .then(updatedTodo => {
            setTodos(prevTodos => {
              return prevTodos.map(t =>
                t.id === updatedTodo.id ? updatedTodo : t,
              );
            });
          })
          .catch(() => setError(ErrorMessage.UPDATE))
          .finally(() => {
            setLoadingTodo(prev => prev.filter(id => id !== todo.id));
          });
      }),
    ).finally(() => {
      if (todosToUpdate.length === 0) {
        setLoadingTodo([]);
      }
    });
  }

  async function handleEdit(
    todo: Todo,
    updatedTitle: string,
  ): Promise<boolean> {
    const normalizedTitle = updatedTitle.trim();

    if (normalizedTitle === todo.title) {
      return true;
    }

    if (normalizedTitle === '') {
      handleDeleteTodo(todo.id);

      return false;
    }

    setLoadingTodo(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: normalizedTitle,
        completed: todo.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
      );

      return true;
    } catch (e) {
      setError(ErrorMessage.UPDATE);

      return false;
    } finally {
      setLoadingTodo(prev => prev.filter(id => id !== todo.id));
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          handleAddTodo={handleAddTodo}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          loading={loading}
          inputRef={inputRef}
          taggleAll={handleTaggleAll}
        />
        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          loadingTodo={loadingTodo}
          handleToggle={handleToggleTodo}
          handleEdit={handleEdit}
          inputRef={inputRef}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteComplited={handleDeleteComplited}
          />
        )}
      </div>
      <ErrorModal
        errorMessage={error}
        onClearError={() => setError(ErrorMessage.NONE)}
      />
    </div>
  );
};
