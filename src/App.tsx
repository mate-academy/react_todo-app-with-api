/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { UserWarning } from './UserWarning';
import { TodoInterface } from './types/TodoInterface';
import * as postServices from './api/todos';
import { Todo } from './api/components/todo';
import { Footer } from './api/components/footer';
import { Error } from './api/components/error';
import { Loader } from './api/components/loader';

const USER_ID = 12030;

function getPreparedTodos(todos: TodoInterface[],
  filter: string): TodoInterface[] {
  const preparedTodos = todos.filter(todo => {
    switch (filter) {
      case 'completed':
        return todo.completed;

      case 'active':
        return !todo.completed;

      default:
        return true;
    }
  });

  return preparedTodos;
}

function todosCounter(todos: TodoInterface[]) {
  return todos.filter(todo => !todo.completed).length;
}

export const App: React.FC = () => {
  const [isloading, setIsloading] = useState(false);
  const [todos, setTodos] = useState<TodoInterface[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<TodoInterface | null>(null);
  const [loadTodosIds, setLoadTodosIds] = useState<number[]>([]);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  function loadTodos() {
    setIsloading(true);

    return postServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => setIsloading(false));
  }

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTodos();
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (postId: number) => {
    setLoadTodosIds(curId => [...curId, postId]);
    postServices.deleteTodo(postId)
      .then(() => {
        setTodos(curTodos => curTodos.filter(t => t.id !== postId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        setTimeout(() => setLoadTodosIds([]), 3000);
      });
  };

  const deleteAll = () => {
    todos.filter(t => t.completed)
      .map((todo) => deleteTodo(todo.id));
  };

  function addTodos({ userId, title, completed }: TodoInterface) {
    if (!title.length) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setInputDisabled(true);

    postServices.addTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos((curTodos) => [...curTodos, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setInputDisabled(false);
        setTempTodo(null);
      });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    addTodos(newTodo);
  };

  const visibleTodos = getPreparedTodos(todos, filter);
  const onFilter = (f: string) => {
    setFilter(f);
  };

  const onCloseError = (e: string) => {
    setErrorMessage(e);
  };

  const onComplete = (todo: TodoInterface) => {
    setLoadTodosIds(curId => [...curId, todo.id]);

    postServices.updateTodo({ ...todo, completed: !todo.completed })
      .then(newTodo => {
        setTodos((currentTodos) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === todo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadTodosIds([]);
      });
  };

  const onCompleteAll = () => {
    if (todos.some(t => !t.completed)) {
      todos.filter(t => !t.completed)
        .map((todo) => onComplete(todo));
    } else {
      todos.map((todo) => onComplete(todo));
    }
  };

  const onEdit = (id: number) => {
    setEditTodoId(id);
  };

  const update = (todo: TodoInterface) => {
    if (editTitle === todo.title) {
      setEditTodoId(null);

      return;
    }

    if (!editTitle) {
      deleteTodo(todo.id);

      return;
    }

    setLoadTodosIds(curId => [...curId, todo.id]);

    postServices.updateTodo({ ...todo, title: editTitle })
      .then(newTodo => {
        setTodos((currentTodos) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === todo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setEditTodoId(null);
        setLoadTodosIds([]);
      });
  };

  document.addEventListener('keyup', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && editTodoId) {
      setEditTodoId(null);
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div
        className="todoapp__content"
      >
        <header className="todoapp__header">
          <button
            type="button"
            className={cn({
              active: visibleTodos.some(t => !t.completed),
            }, 'todoapp__toggle-all')}
            data-cy="ToggleAllButton"
            onClick={() => onCompleteAll()}
          />

          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="newTodoTitleField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              ref={inputField}
              disabled={inputDisabled}
            />
          </form>
        </header>

        <section
          className="todoapp__main"
          data-cy="TodoList"
          hidden={isloading}
        >
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <Todo
                  todo={todo}
                  key={todo.id}
                  onDelete={deleteTodo}
                  deletedPostsIds={loadTodosIds}
                  onComplete={onComplete}
                  editTodoId={editTodoId}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  onEdit={onEdit}
                  update={update}
                />
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition
                key={tempTodo.id}
                timeout={300}
                classNames="item"
              >
                <div
                  data-cy="Todo"
                  className={cn({
                    completed: tempTodo.completed,
                  }, 'todo')}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>
                  <Loader />
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todos.length !== 0 && (
          <Footer
            filter={filter}
            onFilter={onFilter}
            count={todosCounter(todos)}
            showCCButton={!visibleTodos.some(todo => todo.completed)}
            deleteAll={deleteAll}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        onCloseError={onCloseError}
      />
    </div>
  );
};
