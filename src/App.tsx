import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  postTodo,
  deleteTodo,
  patchTodo,
  patchTitleTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';
import { Header } from './Components/Header/Header';
import cn from 'classnames';

export enum SelectOption {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [option, setOption] = useState(SelectOption.All);
  const [loadingTodos, setLoadingTodos] = useState<Record<number, boolean>>({});
  const [titleTodo, setTitleTodo] = useState('');
  const [inputTodo, setInputTodo] = useState(true);
  const inputFocus = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (inputFocus.current && inputTodo) {
      inputFocus.current.focus();
    }
  }, [inputTodo]);

  const filteredTodos = todos.filter(todo => {
    switch (option) {
      case SelectOption.Active:
        return !todo.completed;
      case SelectOption.Completed:
        return todo.completed;
      case SelectOption.All:
      default:
        return true;
    }
  });

  const todosNCLength = todos.filter(todo => !todo.completed).length;
  const todosLength = todos.length === 0 ? true : false;

  const checkSomeCompletedTodos = todos.some(todo => todo.completed === true);
  const checkEveryCompletedTodos = todos.every(todo => todo.completed === true);

  const addTodo = ({ title, userId, completed }: Todo) => {
    postTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodo => [...currentTodo, newTodo]);
        setTitleTodo('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setInputTodo(true);
        setTempTodo(null);
      });
  };

  const deleteTodos = (todoId: number) => {
    setInputTodo(false);
    setLoadingTodos(current => ({ ...current, [todoId]: true }));
    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setInputTodo(true);
        setLoadingTodos(current => {
          const newState = { ...current };

          delete newState[todoId];

          return newState;
        });
      });
  };

  const updateTodo = (selectedTodo: Todo) => {
    setLoadingTodos(current => ({ ...current, [selectedTodo.id]: true }));
    patchTodo(selectedTodo)
      .then(newTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === selectedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() =>
        setLoadingTodos(current => {
          const newState = { ...current };

          delete newState[selectedTodo.id];

          return newState;
        }),
      );
  };

  const updateTitleTodo = (selectedTodo: Todo, newTitle: string) => {
    setLoadingTodos(current => ({ ...current, [selectedTodo.id]: true }));
    patchTitleTodo(selectedTodo, newTitle)
      .then(newTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === selectedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() =>
        setLoadingTodos(current => {
          const newState = { ...current };

          delete newState[selectedTodo.id];

          return newState;
        }),
      );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!titleTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: titleTodo.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    setInputTodo(false);
    addTodo(newTodo);
  };

  const handleClearCompleted = () => {
    todos.map(todo => {
      if (todo.completed) {
        deleteTodos(todo.id);
      }
    });
  };

  const handleToggleAll = () => {
    todos.map(todo => {
      if (!checkEveryCompletedTodos) {
        if (!todo.completed) {
          updateTodo(todo);
        }
      } else {
        updateTodo(todo);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSetTitle={setTitleTodo}
          onSubmit={handleSubmit}
          title={titleTodo}
          onFocus={inputFocus}
          inputTodo={inputTodo}
          onToggleAll={handleToggleAll}
          todosLength={todosLength}
          checker={checkEveryCompletedTodos}
        />

        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodos}
          isLoading={loadingTodos}
          tempTodo={tempTodo}
          onUpdate={updateTodo}
          onUpdateTitle={updateTitleTodo}
        />
        {todos.length !== 0 && (
          <Footer
            todosCounter={todosNCLength}
            checkCompleted={checkSomeCompletedTodos}
            option={option}
            onSetOption={setOption}
            onDeleteCompleted={handleClearCompleted}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
