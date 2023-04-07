import React, { useState, useEffect, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Filter } from './types/Filter';
import { ErrorsMessages } from './types/ErrorsMessages';
import { UserWarning } from './UserWarning';

const USER_ID = 6725;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorsMessages>(
    ErrorsMessages.Hidden,
  );
  const [isHeaderDisabled, setIsHeaderDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processings, setProcessings] = useState<number[]>([]);
  const [currentFilter, setCurrentFilter] = useState<Filter>(Filter.All);

  const showErrorMessage = (message: ErrorsMessages) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(ErrorsMessages.Hidden), 3000);
  };

  const loadTodos = async () => {
    setErrorMessage(ErrorsMessages.Hidden);

    try {
      const dataFromServer = await getTodos();

      setTodos(dataFromServer);
    } catch (error) {
      showErrorMessage(ErrorsMessages.Load);
    }
  };

  const setFilter = (filter: Filter) => {
    setCurrentFilter(filter);
  };

  const filterTodos = (filteringProperty: Filter) => {
    return (
      filteringProperty === Filter.All
        ? todos
        : todos.filter(todo => {
          switch (filteringProperty) {
            case Filter.Active:
              return !todo.completed;
            case Filter.Completed:
              return todo.completed;
            default:
              return null;
          }
        })
    );
  };

  const filteredTodos: Todo[] = useMemo(
    () => filterTodos(currentFilter),
    [todos, currentFilter],
  );

  const addTodo = async (newTodoTitle: string) => {
    try {
      setErrorMessage(ErrorsMessages.Hidden);
      setIsHeaderDisabled(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTodoTitle,
        completed: false,
      });

      const newTodoPost = await createTodo({
        title: newTodoTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos((items) => [...items, newTodoPost]);
    } catch (error) {
      showErrorMessage(ErrorsMessages.Post);
    } finally {
      setTempTodo(null);
      setIsHeaderDisabled(false);
    }
  };

  const filterTodosById = (todoElements: Todo[], id: number) => {
    return todoElements.filter((item) => item.id !== id);
  };

  const removeTodo = async (id: number) => {
    try {
      setErrorMessage(ErrorsMessages.Hidden);
      setProcessings((prev) => [...prev, id]);

      const response = await deleteTodo(id);

      if (response) {
        setTodos(filterTodosById(todos, id));
      }
    } catch (error) {
      showErrorMessage(ErrorsMessages.Delete);
    } finally {
      setProcessings([]);
    }
  };

  const removeCompletedTodos = async () => {
    try {
      setErrorMessage(ErrorsMessages.Hidden);

      const completedTodos = (
        todos.filter(el => el.completed)
          .map(item => item.id)
      );

      setProcessings(completedTodos);

      await Promise.all(
        completedTodos.map(todo => deleteTodo(todo)),
      );

      setTodos((prevState) => {
        return prevState.filter((todo) => !todo.completed);
      });
    } catch (error) {
      showErrorMessage(ErrorsMessages.Delete);
    } finally {
      setProcessings([]);
    }
  };

  const handleChecker = async (id: number, data: Partial<Todo>) => {
    try {
      setErrorMessage(ErrorsMessages.Hidden);
      setProcessings((prev) => [...prev, id]);
      const updatedTodo = await updateTodo(id, data);

      setTodos((oldTodos) => (
        oldTodos.map((todo) => (
          todo.id === id ? updatedTodo : todo
        ))
      ));
    } catch (error) {
      showErrorMessage(ErrorsMessages.Update);
    } finally {
      setProcessings([]);
    }
  };

  const handlerSwitch = async (isAllChecked: boolean) => {
    try {
      setErrorMessage(ErrorsMessages.Hidden);

      const todosIdArray = (
        isAllChecked ? (
          todos.map(item => item.id)
        ) : (
          todos.filter(el => !el.completed)
            .map(item => item.id)
        )
      );

      setProcessings(todosIdArray);

      const chakedTodos = await Promise.all(
        todosIdArray.map(el => updateTodo(el, { completed: !isAllChecked })),
      );

      setTodos((oldTodos) => (
        oldTodos.map((todo) => (
          todosIdArray.includes(todo.id) ? (
            chakedTodos[todosIdArray.indexOf(todo.id)]
          ) : (
            todo
          )
        ))
      ));
    } catch (error) {
      showErrorMessage(ErrorsMessages.Update);
    } finally {
      setProcessings([]);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const isFooterVisible = !!todos.length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TransitionGroup>
      <CSSTransition
        key={0}
        timeout={300}
        classNames="item-temp"
      >
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">
            <Header
              todos={todos}
              addTodo={addTodo}
              onSwitch={handlerSwitch}
              errorMessage={showErrorMessage}
              disabled={isHeaderDisabled}
            />
            <Main
              todos={filteredTodos}
              onCheck={handleChecker}
              removeTodo={removeTodo}
              processings={processings}
              errorMessage={showErrorMessage}
              tempTodo={tempTodo}
            />
            {isFooterVisible && (
              <Footer
                todos={todos}
                setFilter={setFilter}
                currentFilter={currentFilter}
                removeCompletedTodos={removeCompletedTodos}
              />
            )}
          </div>
          <Error
            errorMessage={errorMessage}
            removeMessage={setErrorMessage}
          />
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};
