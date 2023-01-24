/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { FilterList } from './components/FilterList';
import {
  changeCompleteTodo,
  getTodos,
  pushTodo,
  deleteTodo,
  changeTitleTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [visibleTodoList, setVisibleList] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [isClearComplete, setClearComplete] = useState([0]);

  const [emptyFieldError, setEmptyError] = useState(false);
  const [failedAddError, setAddError] = useState(false);
  const [failedDeleteError, setDeleteError] = useState(false);
  const [failedLoadError, setLoadError] = useState(false);
  const [failedChangeError, setChangeError] = useState(false);

  const cancelErrors = () => {
    setEmptyError(false);
    setAddError(false);
    setDeleteError(false);
    setLoadError(false);
    setChangeError(false);
  };

  const fetchTodos = async () => {
    try {
      const loadedTodos = await getTodos(user?.id);

      setTodoList(loadedTodos);
      setVisibleList(loadedTodos);
    } catch {
      setLoadError(true);
      setTimeout(cancelErrors, 3000);
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    fetchTodos();
  }, []);

  const findNewTodoId = (): number => {
    if (todoList.length !== 0) {
      const max = todoList.reduce((a, b) => (a.id > b.id ? a : b));

      return max.id + 1;
    }

    return 3456;
  };

  const pushTodos = async () => {
    const pushedTodo = await pushTodo(findNewTodoId(), newTitle, user?.id);

    setVisibleList(prevTodos => {
      return [...prevTodos, pushedTodo];
    });
    setTodoList(prevTodos => {
      return [...prevTodos, pushedTodo];
    });
  };

  const deleteTodos = async (id: number) => {
    if (id !== 0) {
      try {
        await deleteTodo(id);
        setVisibleList(prevTodos => {
          return (prevTodos.filter(item => item.id !== id));
        });
        setTodoList(prevTodos => {
          return (prevTodos.filter(item => item.id !== id));
        });
      } catch {
        setDeleteError(true);
        setTimeout(cancelErrors, 3000);
      }
    }
  };

  const filterTodos = async (filterBy: Filter) => {
    let todosForfilter = todoList;

    switch (filterBy) {
      case Filter.active:
        todosForfilter = todoList.filter(item => !item.completed);
        setVisibleList(todosForfilter);
        break;
      case Filter.completed:
        todosForfilter = todoList.filter(item => item.completed);
        setVisibleList(todosForfilter);
        break;
      case Filter.clearComplete:
        todoList.map(item => (item.completed
          && setClearComplete([...isClearComplete, item.id])));
        await todoList.map(item => (item.completed && deleteTodos(item.id)));
        setClearComplete([0]);
        break;
      case Filter.all:
        setVisibleList(todoList);
        break;
      default:
        break;
    }
  };

  const onChangeCompleteTodo = async (id: number, complete: boolean) => {
    try {
      await changeCompleteTodo(id, complete);
      setVisibleList(prevTodos => {
        return (prevTodos.map(
          item => (item.id === id
            ? { ...item, completed: !item.completed } : item),
        ));
      });

      setTodoList(prevTodos => {
        return (prevTodos.map(
          item => (item.id === id
            ? { ...item, completed: !item.completed } : item),
        ));
      });
    } catch {
      setChangeError(true);
      setTimeout(cancelErrors, 3000);
    }
  };

  const onChangeTodoTitle = async (id: number, title: string) => {
    if (title.length !== 0) {
      try {
        await changeTitleTodo(id, title);
        setVisibleList(prevTodos => {
          return (prevTodos.map(
            item => (item.id === id
              ? { ...item, title } : item),
          ));
        });
        setTodoList(prevTodos => {
          return (prevTodos.map(
            item => (item.id === id
              ? { ...item, title } : item),
          ));
        });
      } catch {
        setChangeError(true);
      }
    } else {
      deleteTodos(id);
    }
  };

  const countActiveItems = (): number => {
    return todoList.filter(item => !item.completed).length;
  };

  const isCompletedTodo = () => {
    if (todoList.find(item => item.completed)) {
      return true;
    }

    return false;
  };

  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTitle.trim() === '') {
      setEmptyError(true);
      setTimeout(cancelErrors, 3000);
    } else {
      try {
        setIsAdding(true);
        await pushTodos();
        setIsAdding(false);
        setNewTitle('');
      } catch {
        setAddError(true);
        setTimeout(cancelErrors, 3000);
      }
    }
  };

  const toggleAll = () => {
    if (todoList.filter(item => !item.completed).length !== 0) {
      setVisibleList(prevTodos => {
        return (prevTodos.map(item => {
          changeCompleteTodo(item.id, true);

          return ({ ...item, completed: true });
        }));
      });
      setTodoList(prevTodos => {
        return (prevTodos.map(item => {
          changeCompleteTodo(item.id, true);

          return ({ ...item, completed: true });
        }));
      });
    } else {
      setVisibleList(prevTodos => {
        return (prevTodos.map(item => {
          changeCompleteTodo(item.id, false);

          return ({ ...item, completed: false });
        }));
      });
      setTodoList(prevTodos => {
        return (prevTodos.map(item => {
          changeCompleteTodo(item.id, false);

          return ({ ...item, completed: false });
        }));
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todoList.length !== 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn(
                'todoapp__toggle-all',
                {
                  active: todoList.filter(item => !item.completed).length === 0,
                },
              )}
              onClick={() => {
                toggleAll();
              }}
            />
          )}

          <form
            onSubmit={(event) => {
              onSubmitForm(event);
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              value={newTitle}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={(event) => {
                setNewTitle(event.target.value);
              }}
              disabled={isAdding}
            />
          </form>
        </header>

        {user && (
          <section className="todoapp__main" data-cy="TodoList">
            <TodoList
              onChangeComplete={onChangeCompleteTodo}
              todos={visibleTodoList}
              onDelete={deleteTodos}
              onChangeTodo={onChangeTodoTitle}
              isClearComplete={isClearComplete}
            />
          </section>
        )}

        {isAdding && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">{newTitle}</span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        <footer className="todoapp__footer" data-cy="Footer">
          <FilterList
            isCompletedTodo={isCompletedTodo()}
            itemCount={countActiveItems()}
            onFilter={filterTodos}
          />
        </footer>

      </div>

      <ErrorNotification
        emptyFieldError={emptyFieldError}
        failedAddError={failedAddError}
        failedDeleteError={failedDeleteError}
        failedLoadError={failedLoadError}
        failedChangeError={failedChangeError}
      />
    </div>
  );
};
