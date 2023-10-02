import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import * as todosService from './api/todos';
import * as constants from './constants/constants';
import * as filterService from './utils/filterService';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState(TodoStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  function isTitleValid(title: string): boolean {
    return !!title?.trim()?.length;
  }

  const updateTodo = (todo: Todo) => {
    setLoadingTodosIds([todo.id]);

    todosService.updateTodo(todo)
      .then(updatedTodo => {
        setLoadingTodosIds([]);
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setLoadingTodosIds([]);
      });
  };

  const handleCompletedChange = (todoId: number) => {
    const foundTodo = todos.find(todo => todo.id === todoId);

    if (foundTodo) {
      updateTodo({ ...foundTodo, completed: !foundTodo.completed });
    }
  };

  useEffect(() => {
    setIsLoadingTodos(true);

    todosService
      .getTodos()
      .then((todosFromSrever) => {
        setTodos(todosFromSrever);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoadingTodos(false);
      });
  }, []);

  const visibleTodos = filterService.filterTodos(todos, selectedOption);

  const handleChangeSelect = (newOption: TodoStatus) => {
    setSelectedOption(newOption);
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodosIds([todoId]);

    todosService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setLoadingTodosIds([]));
  };

  const handleDeleteAll = () => {
    const filteredTodos = todos.filter((current) => current.completed);

    setLoadingTodosIds(filteredTodos.map((current) => current.id));
    Promise.allSettled(filteredTodos
      .map(todo => todosService.deleteTodo(todo.id)))
      .then((result) => {
        const fulfilledTodoIds: number[] = [];
        let existsFailedDelete = false;

        result.forEach((response, i) => {
          if (response.status === constants.RESPONSE_OK) {
            fulfilledTodoIds.push(filteredTodos[i].id);
          } else {
            existsFailedDelete = true;
          }
        });

        if (existsFailedDelete) {
          setErrorMessage('Unable to delete a todo');
        }

        setLoadingTodosIds([]);
        setTodos(currentTodos => currentTodos
          .filter(current => !fulfilledTodoIds
            .includes(current.id)));
      });
  };

  const handleChangeAllCompleted = () => {
    const isNewCompleted = todos.some(todo => !todo.completed);

    const todosToChange = todos
      .reduce((acc: Todo[], currentTodo: Todo) => {
        if (isNewCompleted !== currentTodo.completed) {
          acc.push({ ...currentTodo, completed: isNewCompleted });
        }

        return acc;
      }, []);

    setLoadingTodosIds(todosToChange.map((current) => current.id));
    Promise.allSettled(todosToChange
      .map(todo => todosService.updateTodo(todo)))
      .then((result) => {
        let existsFailedUpdate = false;

        result.forEach((response, i) => {
          if (response.status === 'rejected') {
            todosToChange[i].completed = !todosToChange[i].completed;
            existsFailedUpdate = true;
          }
        });

        if (existsFailedUpdate) {
          setErrorMessage('Unable to update a todo');
        }

        setLoadingTodosIds([]);
        const newTodos = todos.map(todoItem => {
          const changedTodo = todosToChange
            .find(todoFind => todoFind.id === todoItem.id);

          return changedTodo ?? todoItem;
        });

        setTodos(newTodos);
      });
  };

  const handleAddTodo = (newTitle: string) => {
    if (isTitleValid(newTitle)) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setInputValue(newTitle);
    const newTodo = {
      id: 0,
      userId: constants.USER_ID,
      title: newTitle.trim(),
      completed: false,
    };

    setIsInputDisabled(true);
    todosService
      .addTodo(newTodo)
      .then((createdTodo) => {
        setTempTodo(null);
        setTodos([...todos
          .filter((current) => current.id !== 0), createdTodo]);
        setInputValue('');
      })
      .catch(() => {
        setTodos([...todos
          .filter((current) => current.id !== 0)]);
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsInputDisabled(false);
        setLoadingTodosIds([]);
      });

    if (!tempTodo) {
      const fakeTodo = { ...newTodo, id: 0 };

      setTempTodo(fakeTodo);
      setLoadingTodosIds([fakeTodo.id]);
      setTodos((prevTodos) => [...prevTodos, fakeTodo]);
    }
  };

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
    if (isTitleValid(newTodoTitle)) {
      todosService.deleteTodo(todo.id);

      return;
    }

    updateTodo({
      id: todo.id,
      title: newTodoTitle,
      userId: todo.userId,
      completed: todo.completed,
    });
  };

  return (
    <section className="section container">
      <p className="title is-4">
        <div className="todoapp">
          <h1 className="todoapp__title">todos</h1>

          <div className="todoapp__content">

            <Header
              todos={visibleTodos}
              onInputChange={handleAddTodo}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isInputFieldDisabled={isInputDisabled}
              onHandleChangeCompleted={handleChangeAllCompleted}
            />

            {!isLoadingTodos && (
              <TodoList
                todos={visibleTodos}
                loadingTodosIds={loadingTodosIds}
                onDeleteTodo={handleDeleteTodo}
                onCompletedChange={handleCompletedChange}
                handleUpdateTodo={handleUpdateTodo}
              />
            )}

            {!!todos.length && (
              <Footer
                onChangeSelect={handleChangeSelect}
                selectedOption={selectedOption}
                todos={todos}
                onHandleDeleteAll={handleDeleteAll}
              />
            )}
          </div>

          <ErrorNotification
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        </div>
      </p>
    </section>
  );
};
