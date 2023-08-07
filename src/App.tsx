/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect, useMemo, useState,
} from 'react';
// import { UserWarning } from './UserWarning';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Filter } from './types/Filter';
import { TodoInput } from './components/TodoInput';
import { TodoFooter } from './components/TodoFooter';
import { TodoItem } from './components/TodoItem';
import { Error } from './components/Error';
import { ErrorType } from './types/Error';

const USER_ID = 10822;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputIsDisabled, setInputIsDisabled] = useState(false);

  const areAllCompleted = useMemo(() => (
    todos.every(todo => todo.completed)),
  [todos]);
  const notCompletedTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed).length),
  [todos]);
  const hasOneCompletedTodo = useMemo(() => (
    todos.some(todo => todo.completed)),
  [todos]);

  const filteredTodos = useMemo(() => {
    if (!filter) {
      return todos;
    }

    return todos.filter(todo => {
      switch (filter) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(error => setErrorMessage(error));
  }, []);

  const handleAddTodo = useCallback((title :string) => {
    setInputIsDisabled(true);

    if (!title) {
      setErrorMessage(ErrorType.TODO_TITLE_IS_EMPTY);
      setInputIsDisabled(false);

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(todoToAdd);

    addTodo(todoToAdd)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorType.ADD);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setInputIsDisabled(false);
      });
  }, [todos]);

  const handleDeleteTodo = useCallback(
    (todoId :number) => {
      setProcessingIds(ids => [...ids, todoId]);

      deleteTodo(todoId)
        .then(() => setTodos(currentTodos => (
          currentTodos.filter(todo => todo.id !== todoId))))
        .catch((error) => {
          setErrorMessage(ErrorType.DELETE);
          throw error;
        })
        .finally(() => {
          setProcessingIds(ids => ids.filter(id => id !== todoId));
        });
    }, [todos, processingIds],
  );

  const handleTitleUpdate = useCallback(
    (todoId: number, title: string) => {
      setProcessingIds(ids => [...ids, todoId]);

      if (!title) {
        deleteTodo(todoId);

        return;
      }

      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (todoToUpdate && title !== todoToUpdate.title) {
        updateTodo({ ...todoToUpdate, title })
          .then(updatedTodo => {
            setTodos((currentTodos: Todo[]) => (
              currentTodos.map(todo => (
                todo.id === todoId ? updatedTodo : todo
              ))));
          })
          .catch((error) => {
            setErrorMessage(ErrorType.UPDATE);
            throw error;
          })
          .finally(() => {
            setProcessingIds(ids => ids.filter(id => id !== todoId));
          });
      }
    }, [todos, processingIds],
  );

  const toggleTodoStatus = useCallback(
    (todoId :number) => {
      setProcessingIds(ids => [...ids, todoId]);
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        return;
      }

      const updatedTodo = {
        ...todoToUpdate, completed: !todoToUpdate.completed,
      };

      updateTodo(updatedTodo)
        .then(() => setTodos(currentTodos => (
          currentTodos.map(todo => (
            todo.id === todoId ? updatedTodo : todo)))))
        .catch((error) => {
          setErrorMessage(ErrorType.UPDATE);
          throw error;
        })
        .finally(() => {
          setProcessingIds(ids => ids.filter(id => id !== todoId));
        });
    }, [todos, processingIds],
  );

  const toggleAll = () => {
    Promise.all(
      areAllCompleted
        ? todos.map(todo => toggleTodoStatus(todo.id))
        : todos.filter(todo => !todo.completed)
          .map(todo => toggleTodoStatus(todo.id)),
    )
      .catch(() => setErrorMessage(ErrorType.UPDATE));
  };

  const handleClearCompleted = () => {
    Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo => handleDeleteTodo(todo.id)),
    )
      .catch(() => setErrorMessage(ErrorType.DELETE));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          addTodo={handleAddTodo}
          areAllCompleted={areAllCompleted}
          toggleAll={toggleAll}
          inputIsDisabled={inputIsDisabled}
        />

        <TransitionGroup>
          {filteredTodos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodoStatus={() => toggleTodoStatus(todo.id)}
                deleteTodo={handleDeleteTodo}
                updateTodoTitle={handleTitleUpdate}
                processing={processingIds.includes(todo.id)}
              />
            </CSSTransition>
          ))}
          {tempTodo
            && (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem
                  todo={tempTodo}
                  toggleTodoStatus={() => {}}
                  deleteTodo={() => {}}
                  updateTodoTitle={() => {}}
                  processing
                />
              </CSSTransition>
            )}
        </TransitionGroup>
        {todos.length > 0
          && (
            <TodoFooter
              filter={filter}
              setFilter={setFilter}
              itemsLeft={notCompletedTodosCount}
              hasOneCompletedTodo={hasOneCompletedTodo}
              handleClearCompleted={handleClearCompleted}
            />
          )}
      </div>

      {errorMessage && (
        <Error
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
