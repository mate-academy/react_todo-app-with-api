import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  getTodos, deleteTodo, addTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoInfo } from './components/TodoInfo/TodoInfo';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterTodos, setFilterTodos] = useState('All');
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isToggledAll, setIsToggledAll] = useState(false);
  const [todosToUpdate, setTodosToUpdate] = useState<Todo[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => (setErrorMessage('Unable to load a todos')));
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const onClickAll = () => {
    setFilterTodos('All');
  };

  const onClickActive = () => {
    setFilterTodos('Active');
  };

  const onClickCompleted = () => {
    setFilterTodos('Completed');
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle) {
      setErrorMessage('Title can not be empty');

      return;
    }

    if (user) {
      setTempTodo({
        id: 0,
        title: todoTitle,
        completed: false,
        userId: user.id,
      });

      setIsLoading(true);
      addTodo(todoTitle, user.id)
        .then(response => {
          setTodos(prev => [...prev, {
            id: response.id,
            title: response.title,
            completed: response.completed,
            userId: response.userId,
          }]);
        })
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          setIsLoading(false);
          setTempTodo(null);
          setTodoTitle('');
        });
    }
  };

  const onDeleteTodo = (id: number) => {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => (
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== id))
      ))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });
    setIsLoading(false);
  };

  const onUpdateTodo = (chosenTodo: Todo) => {
    setTodosToUpdate(prev => [...prev, chosenTodo]);

    updateTodo(chosenTodo.id, chosenTodo.title, chosenTodo.completed)
      .then((udpatedTodo) => {
        setTodos(currentTodos => currentTodos.map(todo => (
          todo.id !== udpatedTodo.id
            ? todo
            : {
              id: udpatedTodo.id,
              userId: udpatedTodo.userId,
              title: udpatedTodo.title,
              completed: udpatedTodo.completed,
            }
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setTodosToUpdate([]);
      });
  };

  const onToggleAll = () => {
    setIsLoading(true);
    if (isToggledAll === false) {
      todos.forEach(todo => {
        if (!todo.completed) {
          onUpdateTodo({ ...todo, completed: !todo.completed });
        }
      });
      setIsToggledAll(true);
    } else {
      todos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: !todo.completed });
      });
      setIsToggledAll(false);
    }

    setIsLoading(false);
  };

  const onClickClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        onDeleteTodo(todo.id);
      }
    });
  };

  let visibleTodos = todos;

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  if (filterTodos === 'Active') {
    visibleTodos = todos.filter(todo => !todo.completed);
  }

  if (filterTodos === 'Completed') {
    visibleTodos = todos.filter(todo => todo.completed);
  }

  const todosLeft = visibleTodos.filter(todo => !todo.completed);

  const todosCompleted = visibleTodos.filter(todo => todo.completed).length;

  const toggledAlltodos = visibleTodos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onToggleAll={onToggleAll}
          toggledAlltodos={toggledAlltodos}
        />
        {todos.length !== 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              isLoading={isLoading}
              todosToUpdate={todosToUpdate}
              onUpdateTodo={onUpdateTodo}
            />
            {tempTodo && (
              <TodoInfo
                todo={tempTodo}
                isLoading={isLoading}
                onDeleteTodo={onDeleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            )}
            <Footer
              filterTodos={filterTodos}
              todosLeft={todosLeft}
              todosCompleted={todosCompleted}
              onClickAll={onClickAll}
              onClickActive={onClickActive}
              onClickCompleted={onClickCompleted}
              onClickClearComplited={onClickClearCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
