/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterTodos';
import { List } from './components/Todolist';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { filterTodos } from './utils/filterTodos';

import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | ''>('');
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState(FilterType.All);
  const [disable, setDisable] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    setAllCompleted(todos.every(todo => todo.completed));
  }, [todos]);

  useEffect(() => {
    setLoading(true);
    todoService
      .getTodos()
      .then(todoFromServer => setTodos(todoFromServer))
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableLoadTodos);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filter);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessages.TitleShouldNtBeEmpty);

      return;
    }

    setDisable(true);
    let requestSuccessful = false;
    const temptodo: Todo = {
      userId: todoService.USER_ID,
      title: title.trim(),
      completed: false,
      id: 0,
    };

    setLoadingTodoIds(prev => [...prev, temptodo.id]);
    setTempTodo(temptodo);
    todoService
      .createTodo(temptodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        requestSuccessful = true;
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableAddTodo);

        setTitle(title);
      })
      .finally(() => {
        setDisable(false);
        setLoadingTodoIds(prev => prev.filter(id => id !== temptodo.id));
        setTempTodo(null);
        if (requestSuccessful) {
          setTitle('');
        }
      });
  };

  const handleComplitedToDo = (updatedTodo: Todo) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { id, title, completed } = updatedTodo;

    setLoadingTodoIds(prev => [...prev, id]);

    todoService
      .upDateTodo(id, { title, completed: !completed })
      .then(() => {
        setTodos(
          todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableUpdateTodo);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const deleteTodo = (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);
    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UnableDeleteTodo);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(
      completedTodos.map(todo => {
        setLoadingTodoIds(prev => [...prev, todo.id]);

        return todoService
          .deleteTodo(todo.id)
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.filter(t => t.id !== todo.id),
            );
          })
          .catch(() => {
            setErrorMessage(ErrorMessages.UnableDeleteTodo);
          })
          .finally(() => {
            setLoadingTodoIds(prev =>
              prev.filter(todoId => todoId !== todo.id),
            );
          });
      }),
    );
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = !allCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    Promise.all(
      todosToUpdate.map(todo => {
        setLoadingTodoIds(prev => [...prev, todo.id]);

        return todoService
          .upDateTodo(todo.id, { completed: shouldCompleteAll })
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.map(t =>
                t.id === todo.id ? { ...t, completed: shouldCompleteAll } : t,
              ),
            );
          })
          .catch(() => {
            setErrorMessage(ErrorMessages.UnableUpdateTodo);
          })
          .finally(() => {
            setLoadingTodoIds(prev =>
              prev.filter(todoId => todoId !== todo.id),
            );
          });
      }),
    );
  };

  const updateTodoTitle = (id: number, newTitle: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, title: newTitle } : todo,
      ),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          disable={disable}
          todos={todos}
          allCompleted={allCompleted}
          handleToggleAll={handleToggleAll}
          loading={loading}
        />
        <List
          todos={filteredTodos}
          tempTodo={tempTodo}
          loadingTodoIds={loadingTodoIds}
          handleCompletedTodo={handleComplitedToDo}
          deleteTodo={deleteTodo}
          setLoadingTodoIds={setLoadingTodoIds}
          setErrorMessage={setErrorMessage}
          updateTodoTitle={updateTodoTitle}
          setLoading={setLoading}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            clearCompleted={clearCompleted}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        closeError={() => setErrorMessage('')}
      />
    </div>
  );
};
