/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoRow } from './components/TodoRow';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SortTodos } from './types/SortTodos';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortTodos, setSortTodos] = useState<SortTodos>('All');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processTodoIds, setProcessTodoIds] = useState<number[]>([]);

  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [disableInput, setDisable] = useState(false);

  const [error, setError] = useState<ErrorMessage>(null);
  const [isLoading, setLoader] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [changingValue, setChangingValue] = useState('');

  function sorterTodos(sortStatus: SortTodos) {
    switch (sortStatus) {
      case 'Active':
        return todos.filter((t: Todo) => !t.completed);
      case 'Completed':
        return todos.filter((t: Todo) => t.completed);
      default:
        return todos;
    }
  }

  function loadTodos() {
    todoService
      .getTodos()
      .then(data => {
        setTodos(data);
        setTimeout(() => inputRef.current?.focus(), 0);
      })
      .catch(() => {
        setError('LOAD');
      });
  }

  function creationOfTodo(title: string) {
    setDisable(true);
    setLoader(true);

    const temp: Todo = {
      id: 0,
      title,
      userId: 0,
      completed: false,
    };

    setTempTodo(temp);

    todoService
      .createTodo({ title })
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setInput('');
      })
      .catch(() => {
        setError('ADD');
      })
      .finally(() => {
        setTempTodo(null);
        setTimeout(() => inputRef.current?.focus(), 0);
        setDisable(false);
        setLoader(false);
      });
  }

  function deleteTodo(todoId: number) {
    setProcessTodoIds(ids => [...ids, todoId]);

    setDisable(true);
    setLoader(true);

    todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
        setProcessTodoIds(ids => ids.filter(id => id !== todoId));
      })
      .catch(() => setError('DELETE'))
      .finally(() => {
        setDisable(false);
        setLoader(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      });
  }

  function deleteAllCompleted() {
    todos.filter(todo => todo.completed).map(todo => deleteTodo(todo.id));
  }

  function makeTodoComplete(todo: Todo) {
    setProcessTodoIds(ids => [...ids, todo.id]);

    setLoader(true);

    const todoChange = { ...todo, completed: !todo.completed };

    todoService
      .updateTodo(todoChange)
      .then(() => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? todoChange : t)));
      })
      .catch(() => {
        setError('UPDATE');
      })
      .finally(() => {
        setLoader(false);
        setProcessTodoIds([]);
      });
  }

  function makeAllTodoComplete() {
    if (todos.every(todo => todo.completed)) {
      todos.filter(todo => todo.completed).map(todo => makeTodoComplete(todo));
    } else {
      todos.filter(todo => !todo.completed).map(todo => makeTodoComplete(todo));
    }
  }

  function updateTodo(todo: Todo, updatedTitle: string) {
    switch (updatedTitle) {
      case todo.title:
        setProcessTodoIds([]);

        return;
      case '':
        deleteTodo(todo.id);

        return;
    }

    setLoader(true);

    const todoChange = { ...todo, title: updatedTitle };

    todoService
      .updateTodo(todoChange)
      .then(() => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? todoChange : t)));
        setIsEditing(false);
        setChangingValue('');
        setProcessTodoIds([]);
      })
      .catch(() => {
        setError('UPDATE');
      })
      .finally(() => {
        setLoader(false);
      });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (input.trim().length > 0) {
      creationOfTodo(input.trim());
    } else {
      setError('TITLE');
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todosLength={todos.length}
          isSomeTodoComplete={todos.every(todo => todo.completed)}
          input={input}
          disableInput={disableInput}
          inputRef={inputRef}
          setInput={value => setInput(value)}
          makeAllTodoComplete={makeAllTodoComplete}
          handleSubmit={handleSubmit}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {sorterTodos(sortTodos).map(todo => {
            return (
              <TodoRow
                todo={todo}
                loader={isLoading}
                isEditing={isEditing}
                changingValue={changingValue}
                key={todo.id}
                chosenTodoIds={processTodoIds}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo}
                makeTodoComplete={makeTodoComplete}
                setIsEditing={value => {
                  setIsEditing(value);
                }}
                setChangingValue={value => {
                  setChangingValue(value);
                }}
                addProcessTodoId={value => {
                  setProcessTodoIds(prev => [...prev, value]);
                }}
              />
            );
          })}
          {tempTodo && <TodoItem tempTodo={tempTodo} />}
        </section>

        {todos.length > 0 && (
          <Footer
            itemsLeft={todos.filter(t => !t.completed).length}
            sortTodos={sortTodos}
            disabled={!todos.some(t => t.completed)}
            setSortTodos={setSortTodos}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} />
    </div>
  );
};
