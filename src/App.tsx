import React, { useEffect, useMemo, useState } from 'react';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import Main from './components/Main';
import Header from './components/Header';
import { Filters } from './types/Filters';
import { ErrorsType } from './types/Errors';
import { Errors } from './components/Errors';

const noErrors = {
  loadError: false,
  titleError: false,
  addTodoError: false,
  deleteTodoError: false,
  updateTodoError: false,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<ErrorsType>(noErrors);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingId, setIsLoadingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [editingId, setEditingId] = useState(-1);
  const [editTitle, setEditTitle] = useState('');

  const handleHideError = () => {
    setErrors(noErrors);
  };

  const clearErrors = () => {
    setTimeout(() => {
      handleHideError();
    }, 3000);
  };

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch (error) {
      setErrors({ ...noErrors, loadError: true });
    }
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      setIsLoadingId(-1);
      addTodo(inputValue)
        .then(result => {
          setIsLoadingId(result.id);
          setTodos(prev => [...prev, result]);
          setInputValue('');
          setTimeout(() => setIsLoadingId(null), 500);
        })
        .catch(() => {
          setErrors({ ...noErrors, addTodoError: true });
          clearErrors();
        });
    } else {
      setErrors({ ...noErrors, titleError: true });
      clearErrors();
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoadingId(id);
    try {
      const timer = setTimeout(() => {
        throw Error('no result');
      }, 5000);

      await deleteTodo(id);

      clearTimeout(timer);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      setInputValue('');
      setTimeout(() => setIsLoadingId(null), 500);
    } catch (error) {
      setErrors({ ...noErrors, deleteTodoError: true });
      clearErrors();
    }
  };

  const handleSubmit = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (isLoadingId !== -1) {
        handleAdd();
      }
    }
  };

  const handleEditTodo = async (title: string, todo: Todo) => {
    if (title.trim()) {
      setIsLoadingId(todo.id);
      try {
        await updateTodo(todo.id, { ...todo, title });

        setTodos(
          todos.map(currentTodo => {
            if (todo.id === currentTodo.id) {
              return {
                ...currentTodo,
                title,
              };
            }

            return currentTodo;
          }),
        );
        setIsLoadingId(null);
        setEditingId(-1);
      } catch (error) {
        setErrors({ ...noErrors, updateTodoError: true });
        clearErrors();
      }
    } else {
      handleDelete(todo.id);
    }
  };

  const handleCheckTodo = async (todo: Todo) => {
    setIsLoadingId(todo.id);
    try {
      await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      setIsLoadingId(null);
      setTodos(
        todos.map(currentTodo => {
          if (todo.id === currentTodo.id) {
            return {
              ...currentTodo,
              completed: !todo.completed,
            };
          }

          return currentTodo;
        }),
      );
    } catch (error) {
      setErrors({ ...noErrors, updateTodoError: true });
      clearErrors();
    }
  };

  const handleClearCompleted = () => {
    todos.map(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });

    setTodos(todos.filter(todo => !todo.completed));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const isAllCompleted = useMemo(() => {
    if (completedTodos.length === todos.length) {
      return true;
    } else {
      return false;
    }
  }, [completedTodos, todos]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);

      case Filters.Completed:
        return completedTodos;

      default:
        return todos;
    }
  }, [todos, filter, completedTodos]);

  const changeAllTodos = (props: Partial<Todo>) => {
    todos.map(todo => {
      updateTodo(todo.id, { ...todo, ...props });
    });
  };

  const handleToggleAll = () => {
    if (isAllCompleted) {
      setTodos(
        todos.map(todo => {
          return { ...todo, completed: false };
        }),
      );
      changeAllTodos({ completed: false });
    } else {
      setTodos(
        todos.map(todo => {
          return { ...todo, completed: true };
        }),
      );
      changeAllTodos({ completed: true });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setInputValue={setInputValue}
          inputValue={inputValue}
          handleSubmit={handleSubmit}
          handleToggleAll={handleToggleAll}
          isAllCompleted={isAllCompleted}
        />
        <Main
          visibleTodos={visibleTodos}
          isLoadingId={isLoadingId}
          handleCheckTodo={handleCheckTodo}
          handleDelete={handleDelete}
          handleEditTodo={handleEditTodo}
          setEditTitle={setEditTitle}
          setEditingId={setEditingId}
          editTitle={editTitle}
          editingId={editingId}
        />
        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            completedTodos={completedTodos}
            todos={todos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <Errors handleHideError={handleHideError} errors={errors} />
    </div>
  );
};
