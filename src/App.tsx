/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterName } from './types/FilterName';
import * as todosService from './api/todos';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { TempTodo } from './Components/TempTodo';
import { Footer } from './Components/Footer';
import { ErrorMessage } from './Components/ErrorMessage';

export const USER_ID = 1918;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterName>('ALL');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const activeTodosQuantity = todos.filter(todo => !todo.completed).length;

  function loadTodos() {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }

  const filteredTodos = useMemo(() => {
    switch (activeFilter) {
      case 'ACTIVE':
        return todos.filter(todo => !todo.completed);
      case 'COMPLETED':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, activeFilter]);

  useEffect(() => {
    loadTodos();
    if (!inputDisabled && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [inputDisabled]);

  const handleNewTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
  };

  function addTodo(loadingTodo: Todo) {
    setErrorMessage('');

    todosService
      .createTodo({
        userId: loadingTodo.userId,
        title: loadingTodo.title,
        completed: loadingTodo.completed,
      })
      .then(newTodo => {
        setTempTodo(null);
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setInputDisabled(false);
        if (inputRef.current) {
          inputRef.current?.focus();
        }
      });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    const loadingTodo: Todo = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
      id: 0,
    };

    setTempTodo(loadingTodo);
    setInputDisabled(true);
    addTodo(loadingTodo);
  }

  function deleteTodo(todoId: number) {
    // setEditedTodo(editedTodo);
    // console.log(editedTodo?.title);

    setLoadingTodoId(todoId);
    todosService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setEditedTodo(null);
      })
      .catch(() => {
        setEditedTodo(editedTodo);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingTodoId(null);

        if (!inputDisabled && inputRef.current) {
          inputRef.current?.focus();
        }
      });
  }

  function deleteCompletedTodos() {
    todos.map(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }

  function toggleTodoStatus(
    updatedTodo: Todo,
    status = !updatedTodo.completed,
  ) {
    setLoadingTodoId(updatedTodo.id);

    todosService
      .updateTodo(updatedTodo.id, { completed: status })
      .then((todoResult: Todo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, todoResult);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingTodoId(null);
      });
  }

  function toggleAllTodosStatus() {
    if (activeTodosQuantity === 0) {
      todos.map(todo => {
        toggleTodoStatus(todo, false);
      });
    } else {
      todos.map(todo => {
        if (todo.completed === false) {
          toggleTodoStatus(todo, true);
        }
      });
    }
  }

  function handleTodoTitleUpdate(updatedTodoTitle: string) {
    if (editedTodo) {
      if (editedTodo.title === updatedTodoTitle) {
        setEditedTodo(null);

        return;
      }

      if (!updatedTodoTitle.trim()) {
        deleteTodo(editedTodo.id);
        // setEditedTodo(null);

        return;
      }

      setLoadingTodoId(editedTodo.id);
      todosService
        .updateTodo(editedTodo.id, { title: updatedTodoTitle.trim() })
        .then((todoResult: Todo) => {
          setTodos(currentTodos => {
            const newTodos = [...currentTodos];
            const index = newTodos.findIndex(todo => todo.id === editedTodo.id);

            newTodos.splice(index, 1, todoResult);

            return newTodos;
          });
          setEditedTodo(null);
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
          setTimeout(() => setErrorMessage(''), 3000);
        })
        .finally(() => {
          setLoadingTodoId(null);
        });
    }
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosQuantity={activeTodosQuantity}
          onSubmitNewTodo={handleSubmit}
          onTitleChange={handleNewTodoTitleChange}
          inputDisabled={inputDisabled}
          newTodoTitle={newTodoTitle}
          inputRef={inputRef}
          toggleAllStatuses={toggleAllTodosStatus}
          todos={todos}
        />
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
              loadingTodoId={loadingTodoId}
              onToggleTodoStatus={toggleTodoStatus}
              editedTodo={editedTodo}
              onTodoTitleUpdateSubmit={handleTodoTitleUpdate}
              onTodoEditing={setEditedTodo}
            />
            {tempTodo !== null && <TempTodo tempTodo={tempTodo} />}
          </section>
        )}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            activeTodosQuantity={activeTodosQuantity}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};
