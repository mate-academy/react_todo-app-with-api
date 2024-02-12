/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 100;

type Error = 'Unable to load todos' | 'Title should not be empty' | 'Unable to add a todo' | 'Unable to delete a todo' | 'Unable to update a todo';
type FilPar = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [errorMsg, setErrorMsg] = useState<Error | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filterParam, setFilterParam] = useState<FilPar>('All');
  const [loadingList, setLoadingList] = useState<number[]>([]);
  const [disInput, setDisInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoNewTitle, setTodoNewTitle] = useState('');
  const [redactedTodo, setRedactedTodo] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const todoInputRef = useRef<HTMLInputElement | null>(null);
  const isError = errorMsg !== null;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  function filterTodos() {
    switch (filterParam) {
      case 'Active':
        setVisibleTodos(todos.filter(todo => todo.completed === false));
        break;
      case 'Completed':
        setVisibleTodos(todos.filter(todo => todo.completed));
        break;
      case 'All':
        setVisibleTodos(todos);
        break;
      default:
        break;
    }
  }

  function hideErrorMsg() {
    setTimeout(() => {
      setErrorMsg(null);
    }, 3000);
  }

  function showError(error: Error) {
    setErrorMsg(error);
    setTimeout(() => hideErrorMsg(), 3000);
  }

  useEffect(() => {
    setVisibleTodos(todos);
  }, [todos]);

  useEffect(() => {
    filterTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParam]);

  function loadTodos() {
    todoService.getTodos(USER_ID).then((data) => {
      setTodos(data);
    }).catch(() => showError('Unable to load todos'));
  }

  function deleteTodo(todoId: number) {
    setLoadingList((curList) => [...curList, todoId]);

    todoService.removeTodo(todoId)
      .then(() => loadTodos())
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => setLoadingList(curList => curList.filter(todo => todo !== todoId)));
  }

  function addTodo({ title, completed, userId }: Todo) {
    setDisInput(true);

    todoService.postTodo({ title, completed, userId })
      .then(newPost => {
        setTodos(currTodos => [...currTodos, newPost] as Todo[]);
        setNewTodoTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setDisInput(false);
        setTempTodo(null);
      });
  }

  function updateTodo(updatedPost: Todo) {
    setLoadingList((curList) => [...curList, updatedPost.id]);
    todoService.updateTodo(updatedPost)
      .then(todo => {
        setTodos(currTodos => {
          const newTodo = [...currTodos];
          const index = newTodo.findIndex(todoe => todoe.id === updatedPost.id);

          newTodo.splice(index, 1, todo as Todo);

          return newTodo;
        });
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setLoadingList(curList => curList.filter(todo => todo !== updatedPost.id));
        setRedactedTodo(null);
      });
  }

  function onTodoChange(event: FormEvent, {
    id, title, completed, userId,
  }: Todo) {
    event.preventDefault();

    if (title.length < 1) {
      deleteTodo(id);
    } else {
      updateTodo({
        id, title, completed, userId,
      });
    }
  }

  function redactTodoHandler(todoId: number, todoTitle: string) {
    setTodoNewTitle(todoTitle);
    setRedactedTodo(todoId);
  }

  useEffect(() => {
    if (redactedTodo !== null && todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [redactedTodo]);

  useEffect(loadTodos, []);

  function onDeleteCompleted() {
    todos.filter(todo => todo.completed === true).map(todo => deleteTodo(todo.id));
  }

  function toggleAll() {
    if (todos.some(todo => todo.completed === false)) {
      todos.map(todo => updateTodo({
        id: todo.id, title: todo.title, completed: true, userId: todo.userId,
      }));
    } else {
      todos.map(todo => updateTodo({
        id: todo.id, title: todo.title, completed: false, userId: todo.userId,
      }));
    }
  }

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();
    if (newTodoTitle.trim().length < 1) {
      showError('Title should not be empty');

      return;
    }

    setTempTodo({
      title: newTodoTitle.trim(), completed: false, userId: USER_ID, id: 0,
    });
    addTodo({
      title: newTodoTitle.trim(), completed: false, userId: USER_ID, id: 0,
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', { active: todos.every(todo => todo.completed === true) })}
              data-cy="ToggleAllButton"
              onClick={() => toggleAll()}
            />
          )}
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              disabled={disInput}
              ref={inputRef}
              onChange={(event) => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  checked={todo.completed}
                  className={classNames('todo__status', { completed: todo.completed })}
                  onChange={() => (updateTodo({
                    id: todo.id, title: todo.title, completed: !todo.completed, userId: todo.userId,
                  }))}
                />
              </label>
              {redactedTodo !== todo.id && (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => redactTodoHandler(todo.id, todo.title)}
                  >
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => {
                      deleteTodo(todo.id);
                    }}
                  >
                    ×
                  </button>
                </>
              )}
              {redactedTodo === todo.id && (
                <form
                  onSubmit={(event) => onTodoChange(event, {
                    id: todo.id, title: todoNewTitle, completed: todo.completed, userId: todo.userId,
                  })}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={todoNewTitle}
                    ref={todoInputRef}
                    onChange={(event) => setTodoNewTitle(event.target.value)}
                    onKeyUp={(event) => {
                      if (event.key === 'Escape') {
                        setRedactedTodo(null);
                      }
                    }}
                    onBlur={(event) => {
                      if (todoNewTitle !== todo.title) {
                        onTodoChange(event, {
                          id: todo.id,
                          title: todoNewTitle,
                          completed: todo.completed,
                          userId: todo.userId,
                        });
                      } else {
                        setRedactedTodo(null);
                      }
                    }}
                  />
                </form>
              )}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', { 'is-active': loadingList.includes(todo.id) })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div
              data-cy="Todo"
              className="todo"
              key={tempTodo.id}
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
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => {
                  deleteTodo(tempTodo.id);
                }}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className="modal overlay is-active"
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link ', { selected: filterParam === 'All' })}
                data-cy="FilterLinkAll"
                onClick={() => setFilterParam('All')}
              >
                All
              </a>
              <a
                href="#/active"
                className={classNames('filter__link ', { selected: filterParam === 'Active' })}
                data-cy="FilterLinkActive"
                onClick={() => setFilterParam('Active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={classNames('filter__link ', { selected: filterParam === 'Completed' })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterParam('Completed')}
              >
                Completed
              </a>
            </nav>
            <div>
              <button
                type="button"
                disabled={todos.filter(todo => todo.completed).length < 1}
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={() => onDeleteCompleted()}
              >
                Clear completed
              </button>
            </div>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames('notification is-danger is-light has-text-weight-normal', { hidden: !isError })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideErrorMsg}
        />
        {errorMsg}
      </div>
    </div>
  );
};
