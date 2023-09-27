import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import * as todosService from './api/todos';
import { USER_ID } from './api/todos';
import * as filterService from './utils/filterService';

export const App: React.FC = () => {
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState(TodoStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputFieldDisabled, setIsInputFieldDisabled] = useState(false);

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
    setLoadingTodos(true);

    todosService
      .getTodos()
      .then((todosFromSrever) => {
        setTodos(todosFromSrever);
        setLoadingTodos(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setLoadingTodos(false);
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
        setLoadingTodosIds([]);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setLoadingTodosIds([]);
      })
      .finally(() => setLoadingTodosIds([todoId]));
  };

  const handleDeleteAll = () => {
    const filteredTodos = todos.filter((current) => current.completed);

    setLoadingTodosIds(filteredTodos.map((current) => current.id));
    Promise.allSettled(filteredTodos
      .map(todo => todosService.deleteTodo(todo.id)))
      .then((rezult) => {
        // rezult: {status: 'fulfilled'|'rejected'}[];
        const fulfilledTodoIds: number[] = [];
        let wasFailed = false;

        rezult.forEach((response, i) => {
          if (response.status === 'fulfilled') {
            fulfilledTodoIds.push(filteredTodos[i].id);
          } else {
            wasFailed = true;
          }
        });

        if (wasFailed) {
          setErrorMessage('Unable to delete a todo');
        }

        setLoadingTodosIds([]);
        setTodos(currentTodos => currentTodos
          .filter(current => !fulfilledTodoIds
            .includes(current.id)));
      });
  };

  const handleChangeAllCompleted = () => {
    const isNewCompleted = !!todos.find(todo => todo.completed === false);

    const todosToChange = todos
      .filter(currentTodo => isNewCompleted !== currentTodo.completed)
      .map(currentTodo => ({ ...currentTodo, completed: isNewCompleted }));

    setLoadingTodosIds(todosToChange.map((current) => current.id));
    Promise.allSettled(todosToChange
      .map(todo => todosService.updateTodo(todo)))
      .then((rezult) => {
        // rezult: {status: 'fulfilled'|'rejected'}[];
        let wasFailed = false;

        rezult.forEach((response, i) => {
          if (response.status === 'rejected') {
            todosToChange[i].completed = !todosToChange[i].completed;
            wasFailed = true;
          }
        });

        if (wasFailed) {
          setErrorMessage('Unable to delete a todo');
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
    const todoIds = todos.map(({ id }) => id);
    const maxTodoId = Math.max(...todoIds);

    if (!newTitle?.trim()?.length) {
      setErrorMessage('Title should not be empty');
    } else {
      setInputValue(newTitle);
      const newTodo = {
        id: maxTodoId + 1,
        userId: USER_ID,
        title: newTitle.trim(),
        completed: false,
      };

      setIsInputFieldDisabled(true);
      todosService
        .addTodo(newTodo)
        .then((createdTodo) => {
          setLoadingTodosIds([]);
          setTempTodo(null);
          setTodos([...todos
            .filter((current) => current.id !== 0), createdTodo]);
          setInputValue('');
          setIsInputFieldDisabled(false);
        })
        .catch(() => {
          setIsInputFieldDisabled(false);
          setLoadingTodosIds([]);
          setTodos([...todos
            .filter((current) => current.id !== 0)]);
          setErrorMessage('Unable to add a todo');
        });

      if (tempTodo === null) {
        const fakeTodo = { ...newTodo, id: 0 };

        setTempTodo(fakeTodo);
        setLoadingTodosIds([fakeTodo.id]);
        setTodos((prevTodos) => [...prevTodos, fakeTodo]);
      }
    }
  };

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
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
              isInputFieldDisabled={isInputFieldDisabled}
              onHandleChangeCompleted={handleChangeAllCompleted}
            />

            {!loadingTodos && (
              <section
                className="todoapp__main"
                data-cy="TodoList"
              >
                {visibleTodos.map(todo => (
                  <TodoItem
                    onDeleteTodo={handleDeleteTodo}
                    todo={todo}
                    key={todo.id}
                    onCompletedChange={handleCompletedChange}
                    isLoading={loadingTodosIds.includes(todo.id)}
                    onUpdateTodo={
                      (todoTitle: string) => handleUpdateTodo(todo, todoTitle)
                    }
                  />
                ))}
              </section>
            )}

            {todos.length !== 0 && (
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
