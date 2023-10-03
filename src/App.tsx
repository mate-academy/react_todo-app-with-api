import React, { useEffect, useRef, useState } from 'react';
import { ErrorType, FilterType, Todo } from './types/Todo';
import {
  getTodos,
  postTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { ErrorPopup } from './components/ErrorPopup';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

const USER_ID = 11546;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(
    'All',
  );
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [todoItem, setTodoItem] = useState<Todo | null>(null);
  const [currentTodoLoading, setCurrentTodoLoading] = useState<number | null>(
    null,
  );

  const newTodoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, []);

  const handleErrorMessage = (message: ErrorType | null) => {
    setError(message);

    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const focusOnNewTodoInput = () => {
    if (newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  };

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    if (!trimmedTitle) {
      handleErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    setTodoItem({ ...newTodo, id: 0 });
    setIsLoading(true);

    try {
      const createdTodo = await postTodo(newTodo);

      setTodos([...todos, createdTodo]);
      setNewTitle('');
    } catch (e) {
      handleErrorMessage(ErrorType.UnableToAddTodo);
    } finally {
      setTodoItem(null);
      setIsLoading(false);
      focusOnNewTodoInput();
    }
  };

  const handleDeleteTodo = async (todo: Todo) => {
    setIsLoading(true);
    setCurrentTodoLoading(todo.id);

    try {
      await deleteTodo(todo.id);

      setTodos((prevTodos) => prevTodos.filter((item) => item.id !== todo.id));
    } catch (err) {
      handleErrorMessage(ErrorType.UnableToDeleteTodo);
    } finally {
      setIsLoading(false);
      focusOnNewTodoInput();
    }
  };

  const handleClearCompleted = async () => {
    setIsLoading(true);

    try {
      const completedTodos = todos.filter((todo) => todo.completed);

      await Promise.all(
        completedTodos.map(async (todo) => {
          await deleteTodo(todo.id);
          setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        }),
      );
    } catch (err) {
      handleErrorMessage(ErrorType.UnableToDeleteTodo);
    } finally {
      setIsLoading(false);
      setCurrentTodoLoading(null);
      focusOnNewTodoInput();
    }
  };

  const handleToggleComplete = async (todoToToggle: Todo) => {
    setIsLoading(true);
    setCurrentTodoLoading(todoToToggle.id);

    const updatedTodos = todos.map((todo) => {
      return todo.id === todoToToggle.id
        ? { ...todo, completed: !todoToToggle.completed }
        : todo;
    });

    try {
      await updateTodo(todoToToggle.id, { completed: !todoToToggle.completed });
      setTodos(updatedTodos);
    } catch (err) {
      handleErrorMessage(ErrorType.UnableToUpdateTodo);
    } finally {
      setIsLoading(false);
      setCurrentTodoLoading(null);
    }
  };

  const handleTitleUpdate = (todoId: number, newTodoTitle: string) => {
    setTodos((prevTodos) => prevTodos.map((item) => (item.id === todoId
      ? { ...item, title: newTodoTitle } : item)));
  };

  const changeFilterStatus = (type: FilterType) => {
    setFilterType(type);
  };

  const toggleAll = async () => {
    setIsLoading(true);

    try {
      const allCompleted = todos.every((todo) => todo.completed);

      const todosToUpdate = todos.filter((todo) => !todo.completed);

      const updatedTodos = todosToUpdate.map((todo) => ({
        ...todo,
        completed: !allCompleted,
      }));

      await Promise.all(
        updatedTodos.map(async (todo) => {
          await updateTodo(todo.id, { completed: !allCompleted });
        }),
      );

      const newTodos = todos.map((todo) => {
        const updatedTodo = updatedTodos.find(
          (updated) => updated.id === todo.id,
        );

        return updatedTodo || todo;
      });

      setTodos(newTodos);
    } catch (err) {
      handleErrorMessage(ErrorType.UnableToUpdateTodo);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setError(null);
    getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        handleErrorMessage(ErrorType.UnableToLoadTodos);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.some((todo) => !todo.completed) && (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              type="button"
              data-cy="ToggleAllButton"
              className={`todoapp__toggle-all ${
                todos.every((todo) => todo.completed) ? 'active' : ''
              }`}
              onClick={() => toggleAll()}
            />
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTodo(newTitle);
            }}
          >
            <input
              ref={newTodoInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              filterType={filterType}
              handleDeleteTodo={handleDeleteTodo}
              handleToggleComplete={handleToggleComplete}
              todoItem={todoItem}
              currentTodoLoading={currentTodoLoading}
              handleErrorMessage={handleErrorMessage}
              handleTitleUpdate={handleTitleUpdate}
            />

            <Footer
              todos={todos}
              filterType={filterType}
              changeFilterStatus={changeFilterStatus}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorPopup error={error} setError={setError} />
    </div>
  );
};
