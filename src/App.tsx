/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, editTodo, getTodos } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { FilterParams, filterTodos } from './utils/filterTodos';
import { ErrorNotification } from './components/ErrorsNotification';
import { ErroMessage } from './utils/errorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMesage, setErrorMessage] = useState<ErroMessage>(
    ErroMessage.NO_ERRORS,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selected, setSelected] = useState<FilterParams>(FilterParams.ALL);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [shouldFocusInput, setShouldFocusInput] = useState(false);

  const activeTodos = filterTodos(todos, FilterParams.ACTIVE);

  const selectTodoFilter = (filter: FilterParams) => {
    setSelected(filter);
  };

  const todosAfterFilter = filterTodos(todos, selected);

  const addTodo = (newTodo: Todo): void => {
    setTodos([...todos, newTodo]);
  };

  const handleErrorMessages = (
    newErrorMessage = ErroMessage.NO_ERRORS,
  ): void => {
    setErrorMessage(newErrorMessage);
  };

  const onDelete = async (todoItem: Todo, shouldFocus: boolean) => {
    try {
      setIsLoading(prev => [...prev, todoItem.id]);
      setShouldFocusInput(shouldFocus);
      await deleteTodo(todoItem.id).then(() =>
        setTodos(todos.filter(todo => todo.id !== todoItem.id)),
      );
    } catch {
      handleErrorMessages(ErroMessage.DELETE);
    } finally {
      setIsLoading(prev => prev.filter(id => id !== todoItem.id));
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed === true);

    await Promise.all(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);

          setTodos(prevState => prevState.filter(el => el.id !== todo.id));
        } catch (err) {
          handleErrorMessages(ErroMessage.DELETE);
        }
      }),
    );
  };

  const addEditedTodo = (editedTodo: Todo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === editedTodo.id ? editedTodo : todo)),
    );
  };

  const completeAllTodos = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(async todo => {
        try {
          setIsLoading(prev => [...prev, todo.id]);
          const res = await editTodo<Todo>(todo.id, {
            ...todo,
            completed: !todo.completed,
          });

          setTodos(prev => {
            return prev.map(prevTodo =>
              prevTodo.id === todo.id ? res : prevTodo,
            );
          });
        } catch {
          handleErrorMessages(ErroMessage.UPDATE);
        } finally {
          setIsLoading(prev => prev.filter(id => id !== todo.id));
        }
      });
    } else {
      const completedTodos = todos.filter(todo => todo.completed === true);

      completedTodos.forEach(async todo => {
        try {
          setIsLoading(prev => [...prev, todo.id]);
          const res = await editTodo<Todo>(todo.id, {
            ...todo,
            completed: !todo.completed,
          });

          setTodos(prev => {
            return prev.map(prevTodo =>
              prevTodo.id === todo.id ? res : prevTodo,
            );
          });
        } catch {
          handleErrorMessages(ErroMessage.UPDATE);
        } finally {
          setIsLoading(prev => prev.filter(id => id !== todo.id));
        }
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodos();

        setTodos(response);
      } catch (error) {
        handleErrorMessages(ErroMessage.LOAD);
      }
    };

    fetchData();
  }, [selected]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          handleErrorMessages={handleErrorMessages}
          setTempTodo={setTempTodo}
          setIsLoading={setIsLoading}
          setTodos={setTodos}
          completeAllTodos={completeAllTodos}
          shouldFocusInput={shouldFocusInput}
          setShouldFocusInput={setShouldFocusInput}
        />
        {!!todos.length && (
          <TodoList
            todos={todosAfterFilter}
            tempTodo={tempTodo}
            onDelete={onDelete}
            addEditedTodo={addEditedTodo}
            handleErrorMessages={handleErrorMessages}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        {!!todos.length && (
          <Footer
            activeCount={activeTodos.length}
            selected={selected}
            selectTodoFilter={selectTodoFilter}
            clearCompleted={clearCompleted}
            todos={todos}
            setShouldFocusInput={setShouldFocusInput}
          />
        )}
      </div>
      <ErrorNotification
        handleErrorMessages={handleErrorMessages}
        errorMesage={errorMesage}
      />
    </div>
  );
};
