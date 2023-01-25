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
  const [newTitle, setNewTitle] = useState('');
  const [filterValue, setFilterValue] = useState(Filter.all);

  const [isAdding, setIsAdding] = useState(false);
  const [isClearComplete, setClearComplete] = useState([0]);

  const [errors, setErrors] = useState({
    emptyField: false,
    failedAdd: false,
    failedDelete: false,
    failedLoad: false,
    failedChange: false,
  });

  const cancelErrors = () => {
    setErrors({
      emptyField: false,
      failedAdd: false,
      failedDelete: false,
      failedLoad: false,
      failedChange: false,
    });
  };

  const fetchTodos = async () => {
    try {
      const loadedTodos = await getTodos(user?.id);

      setTodoList(loadedTodos);
    } catch {
      setErrors({
        ...errors,
        failedLoad: true,
      });
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

    return 1;
  };

  const pushTodos = async () => {
    const pushedTodo = await pushTodo(findNewTodoId(), newTitle, user?.id);

    setTodoList(prevTodos => {
      return [...prevTodos, pushedTodo];
    });
  };

  const removeTodo = async (id: number) => {
    if (id !== 0) {
      try {
        await deleteTodo(id);
        setTodoList(prevTodos => {
          return (prevTodos.filter(item => item.id !== id));
        });
      } catch {
        setErrors({
          ...errors,
          failedDelete: true,
        });
        setTimeout(cancelErrors, 3000);
      }
    }
  };

  const filterTodos = async (filterBy: Filter) => {
    switch (filterBy) {
      case Filter.active:
        setFilterValue(Filter.active);
        break;
      case Filter.completed:
        setFilterValue(Filter.completed);
        break;
      case Filter.all:
        setFilterValue(Filter.all);
        break;
      default:
        break;
    }
  };

  const onClearComplete = async () => {
    todoList.map(item => (item.completed
      && setClearComplete([...isClearComplete, item.id])));

    await todoList.map(item => (item.completed && removeTodo(item.id)));

    setClearComplete([0]);
  };

  const onChangeCompleteTodo = async (id: number, complete: boolean) => {
    try {
      await changeCompleteTodo(id, complete);

      setTodoList(prevTodos => {
        return (prevTodos.map(
          item => (item.id === id
            ? { ...item, completed: !item.completed } : item),
        ));
      });
    } catch {
      setErrors({
        ...errors,
        failedChange: true,
      });
      setTimeout(cancelErrors, 3000);
    }
  };

  const onChangeTodoTitle = async (id: number, title: string) => {
    if (title.length !== 0) {
      try {
        await changeTitleTodo(id, title);
        setTodoList(prevTodos => {
          return (prevTodos.map(
            item => (item.id === id
              ? { ...item, title } : item),
          ));
        });
      } catch {
        setErrors({
          ...errors,
          failedChange: true,
        });
        setTimeout(cancelErrors, 3000);
      }
    } else {
      removeTodo(id);
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
      setErrors({
        ...errors,
        emptyField: true,
      });
      setTimeout(cancelErrors, 3000);
    } else {
      try {
        setIsAdding(true);
        await pushTodos();
        setIsAdding(false);
        setNewTitle('');
      } catch {
        setErrors({
          ...errors,
          failedAdd: true,
        });
        setTimeout(cancelErrors, 3000);
      }
    }
  };

  const toggleAll = () => {
    if (todoList.filter(item => !item.completed).length !== 0) {
      setTodoList(prevTodos => {
        return (prevTodos.map(item => {
          changeCompleteTodo(item.id, true);

          return ({ ...item, completed: true });
        }));
      });
    } else {
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
              onClick={toggleAll}
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
              todos={todoList}
              filterValue={filterValue}
              onDelete={removeTodo}
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
            onClearComplete={onClearComplete}
          />
        </footer>

      </div>

      <ErrorNotification
        errors={errors}
      />
    </div>
  );
};
