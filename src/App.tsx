/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import * as postService from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TodoInfo } from './components/TodoInfo';
import { NewTodo } from './components/NewTodo';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState<Todo[]>([]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    postService
      .getTodos(postService.USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        handleError('Unable to load todos');

        return <UserWarning />;
      });
  }, []);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      handleError('Title should not be empty');

      return;
    }

    const currentTodo = {
      id: 0,
      title: trimmedTitle,
      userId: postService.USER_ID,
      completed: false,
    };

    setTempTodo(currentTodo);

    postService
      .addTodo(currentTodo)
      .then(createdTodo => {
        setTodos(prevTodos => [...prevTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        handleError(`Unable to add a todo`);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setIsLoading([updatedTodo]);

    postService
      .updateTodo(updatedTodo)
      .then(todoFromServer => {
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];
          const index = newTodos.findIndex(
            todoItem => todoItem.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todoFromServer);

          return newTodos;
        });
      })
      .catch(() => {
        handleError(`Unable to update a todo`);
      })
      .finally(() => {
        setIsLoading([]);
      });
  };

  const handleToggleAll = () => {
    let actualTodos = todos.filter(todo => !todo.completed);

    if (actualTodos.length === 0) {
      actualTodos = todos.map(todo => ({ ...todo, completed: false }));
    } else {
      actualTodos = actualTodos.map(todo => ({ ...todo, completed: true }));
    }

    for (let i = 0; i < actualTodos.length; i++) {
      handleUpdateTodo(actualTodos[i]);
    }
  };

  const deleteTodo = (todosForDelete: Todo[]) => {
    setIsLoading(todosForDelete);

    for (let i = 0; i < todosForDelete.length; i++) {
      const todoForDelete = {
        id: todosForDelete[i].id,
        title,
        userId: postService.USER_ID,
        completed: false,
      };

      setTempTodo(todoForDelete);

      postService
        .delTodo(todosForDelete[i].id)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== todosForDelete[i].id),
          );
        })
        .catch(() => {
          handleError(`Unable to delete a todo`);
          setTempTodo(null);
          setIsLoading([]);

          return <UserWarning />;
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const onDeleteCompletedTodos = () => {
    deleteTodo(completedTodos);
  };

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleFormSubmit}
          inputText={title}
          activeTodosQTY={activeTodos.length}
          handleInputText={setTitle}
          handleToggleAll={handleToggleAll}
          tempTodo={tempTodo}
          allTodosQTY={todos.length}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoInfo
                  key={todo.id}
                  todoInfo={todo}
                  onDelete={deleteTodo}
                  todosForProcesing={isLoading}
                  onUpdate={handleUpdateTodo}
                />
              </CSSTransition>
            ))}

            {tempTodo?.id === 0 && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <NewTodo tempTitle={tempTodo.title} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeTodosQTY={activeTodos.length}
            completedTodosQTY={completedTodos.length}
            selectedFilter={filter}
            onDeleteCompletedTodos={onDeleteCompletedTodos}
            onFilterSelect={setFilter}
          />
        )}
      </div>
      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
