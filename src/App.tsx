/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { StatusFilter } from './services/EnumStatusFilter';

const USER_ID = 11678;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [titl, setTitl] = useState('');
  const count = todos.filter((todo) => !todo.completed).length;
  const [
    selectTodoFilteredList,
    setSelectTodoFilteredList,
  ] = useState(StatusFilter.ALL);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [checkedLoading, setCheckedLoading] = useState(false);
  const [toggle, setToggle] = useState('');
  const fieldTitle = useRef<HTMLInputElement | null>(null);

  // eslint-disable-next-line
  const filterTodos = useMemo(() => {
    return todos.filter((todo) => {
      const { completed } = todo;

      switch (selectTodoFilteredList) {
        case StatusFilter.ALL: return true;
        case StatusFilter.ACTIVE: return !completed;
        case StatusFilter.COMPLETED: return completed;
        default: return true;
      }
    });
  }, [todos, selectTodoFilteredList]);

  const addTodo = ({ userId, title, completed }: Todo) => {
    setErrorMessage('');

    return todosService.addNewTodo({ userId, title, completed })
      .then((newTodo) => {
        setTodos(currentTodos => {
          return [...currentTodos, newTodo];
        });
        setTitl('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  const deleteTodo = (todoId: number) => {
    return todosService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter((currTodo) => currTodo.id !== todoId));
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      });
  };

  const deleteAllCheckedTodos = (ids: number[]) => {
    ids.map((id) => {
      setCheckedLoading(true);

      return todosService.deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter((currTodo) => currTodo.id !== id));
        })
        .catch((error) => {
          setCheckedLoading(false);
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
          throw error;
        })
        .finally(() => {
          fieldTitle.current?.focus();
          setCheckedLoading(false);
        });
    });
  };

  const updateTodo = (upTodo: Todo) => {
    setErrorMessage('');

    return todosService.updateTodo(upTodo)
      .then((tod) => {
        setTodos(currentTodos => {
          const copyTodos = [...currentTodos];
          const index = copyTodos.findIndex((todo) => todo.id === upTodo.id);

          copyTodos.splice(index, 1, tod);

          return copyTodos;
        });
      })
      .catch((error: Error) => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        throw error;
      });
  };

  useEffect(() => {
    if (USER_ID) {
      todosService.getTodos(USER_ID).then(tod => {
        setTodos(tod);
      }).catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={titl}
          userId={USER_ID}
          onSetTitle={setTitl}
          onTitleError={setErrorMessage}
          onAddTodo={addTodo}
          onTempTodo={setTempTodo}
          checkedAllTodos={updateTodo}
          setToggle={setToggle}
          fieldTitle={fieldTitle}
        />

        {
          todos.length > 0 && (
            <Main
              todos={filterTodos}
              onDeleteTodo={deleteTodo}
              tempTodo={tempTodo}
              onCheckedTodo={updateTodo}
              updateTitle={updateTodo}
              checkedLoading={checkedLoading}
              toggle={toggle}
              fieldTitle={fieldTitle}
            />
          )
        }

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            countTodos={count}
            selectTodoFilteredList={selectTodoFilteredList}
            setSelectTodoFilteredList={setSelectTodoFilteredList}
            removeCompletedTodos={deleteAllCheckedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal
          ${!errorMessage && 'hidden'}`}
      >
        <button
          aria-label="Close message"
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
