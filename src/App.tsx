/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import {
  getTodos,
  deleteTodo,
  patchTodoCompleted,
  patchTodoTitle,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Errors } from './types/Errors';
import { Header } from './components/Header';

export const USER_ID = 9960;

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(TodoFilter.ALL);
  const [typeError, setTypeError] = useState<Errors | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [completedAll, setCompletedAll] = useState(false);
  const [loaderTodo, setLoaderTodo] = useState(0);

  const filteredList = useMemo(() => {
    if (TodoFilter.ALL !== selectedFilter) {
      switch (selectedFilter) {
        case TodoFilter.ACTIVE:
          return todoList.filter((todo) => !todo.completed);
        case TodoFilter.COMPLETED:
          return todoList.filter((todo) => todo.completed);
        default:
          break;
      }
    }

    return todoList;
  }, [selectedFilter, todoList]);

  const countItemLeft = todoList?.filter(todo => !todo.completed).length;

  const deleteClickHandlerItem = (id: number) => {
    deleteTodo(id)
      .then(() => {
        const newArray = todoList ? [...todoList] : [];

        setTodoList(newArray.filter(todo => todo.id !== id));
        setLoaderTodo(0);
      })
      .catch(() => {
        setTypeError(Errors.REMOVE);
      });
  };

  const deleteClickHandlerFooter = () => {
    const completedTodo
    = todoList?.filter(todo => todo.completed).map(todo => todo.id);

    if (completedTodo) {
      setLoadingTodoIds(completedTodo);
    }

    completedTodo?.forEach(todo => {
      deleteTodo(todo)
        .then(() => {
          if (todoList) {
            setTodoList(
              todoList.filter(todoFilter => {
                return !completedTodo.includes(todoFilter.id);
              }),
            );
          }
        })
        .catch(() => {
          setTypeError(Errors.REMOVE);
        });
    });
  };

  const patchHandlerTodoCompleted = (
    id: number,
    completed: boolean,
    bringInList: boolean,
  ) => {
    patchTodoCompleted(id, completed)
      .then(() => {
        setLoaderTodo(0);

        if (bringInList) {
          const newArray = todoList?.map(todo => {
            const newTodo = { ...todo };

            if (todo.id === id) {
              newTodo.completed = completed;

              return newTodo;
            }

            return newTodo;
          });

          if (newArray) {
            setTodoList(newArray);
          }
        }
      })
      .catch(() => {
        setTypeError(Errors.UPDATE);
      });
  };

  const patchHandlerTodoTitle = (
    id: number,
    title: string,
  ) => {
    patchTodoTitle(id, title)
      .then(() => {
        setLoaderTodo(0);

        const newArray = todoList?.map(todo => {
          const newTodo = { ...todo };

          if (todo.id === id) {
            newTodo.title = title;
          }

          return newTodo;
        });

        if (newArray) {
          setTodoList(newArray);
        }
      })
      .catch(() => {
        setTypeError(Errors.UPDATE);
      });
  };

  const toggleAllHandler = () => {
    const newArray = todoList.map(todo => {
      const newTodo = { ...todo };

      if (newTodo.completed === completedAll) {
        patchHandlerTodoCompleted(newTodo.id, !completedAll, false);
        newTodo.completed = !completedAll;
      }

      return newTodo;
    });

    setCompletedAll(!completedAll);

    if (newArray) {
      setTodoList(newArray);
    }
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => {
        setTypeError(Errors.UPDATE);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          USER_ID={USER_ID}
          counterItemLeft={countItemLeft}
          setTypeError={setTypeError}
          todoList={todoList}
          setTempTodo={setTempTodo}
          setTodoList={setTodoList}
          toggleAllHandler={toggleAllHandler}
        />

        {todoList && (
          <TodoList
            filteringList={filteredList}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            deleteClickHandler={deleteClickHandlerItem}
            patchHandlerTodoCompleted={patchHandlerTodoCompleted}
            patchHandlerTodoTitle={patchHandlerTodoTitle}
            setLoaderTodo={setLoaderTodo}
            loaderTodo={loaderTodo}
          />
        )}

        {(todoList && todoList?.length !== 0) && (
          <Footer
            countItemLeft={countItemLeft}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            todoList={todoList}
            deleteClickHandlerFooter={deleteClickHandlerFooter}
          />
        )}

      </div>

      <Notification
        setTypeError={setTypeError}
        typeError={typeError}
      />
    </div>
  );
};
