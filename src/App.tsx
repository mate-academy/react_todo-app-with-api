/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, useEffect, useState } from 'react';
import {
  postTodo,
  getTodos,
  patchTodo,
  removeTodo,
} from './api/todos';
import { Notification } from './components/Notification';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList, getVisibleTodos } from './components/TodoList';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { FilteringMethod, Footer } from './components/Footer';

const USER_ID = 6648;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isInputDisabled, disableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilteringMethod>('All');
  const [loadingTodosIDs, setLoadingTodosIDs] = useState<number[]>([]); // problem is here
  const [textFieldValue, setTextFieldValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);

  useEffect(() => {
    getTodos(USER_ID)
      .then(result => {
        setTodos(result);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.NONE);
        }, 3000);
      });
  }, []);

  const addTodo = () => {
    disableInput(true);

    const newTodo = {
      title: textFieldValue,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    postTodo(newTodo)
      .then(result => {
        setTodos(prev => [
          ...prev,
          result,
        ]);

        setTextFieldValue('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.ADD);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.NONE);
        }, 3000);
      })
      .finally(() => {
        disableInput(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (id: number) => {
    setLoadingTodosIDs(prevState => [...prevState, id]);

    return removeTodo(id)
      .then(() => {
        const newTodosList = todos.filter(todo => todo.id !== id);

        setTodos(newTodosList);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETE);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.NONE);
        }, 3000);
      })
      .finally(() => {
        setLoadingTodosIDs([]);
      });
  };

  const deleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(uncompletedTodos);
        });
    });
  };

  const updateTodo = (id: number, data: object) => { // problem is here
    setLoadingTodosIDs(prevState => [...prevState, id]);

    return patchTodo(id, data)
      .then(() => {
        setTodos((prev) => prev.map(todo => {
          if (todo.id === id) {
            return {
              ...todo,
              ...data,
            };
          }

          return todo;
        }));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UPDATE);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.NONE);
        }, 3000);
      })
      .finally(() => {
        setLoadingTodosIDs(prevState => prevState.filter(num => num !== id));
        // setLoadingTodosIDs([]);
      });
  };

  const updateAll = () => {
    const isAllDone = todos.every(todo => todo.completed);

    if (isAllDone) {
      setLoadingTodosIDs(todos.map(todo => todo.id));

      const disabledTodos = todos.map(todo => (
        { ...todo, completed: false }
      ));

      todos.forEach(todo => {
        updateTodo(todo.id, { completed: false })
          .then(() => {
            setTodos(disabledTodos);
          });
      });
    } else {
      const doneTodos = todos.map(todo => (
        { ...todo, completed: true }
      ));

      const notDoneTodos = todos.filter(todo => !todo.completed);

      notDoneTodos.forEach(todo => {
        updateTodo(todo.id, { completed: false })
          .then(() => {
            setTodos(doneTodos);
          });
      });
    }
  };

  const handletextFieldValue = (value: string) => {
    setTextFieldValue(value);
  };

  const handleSubmit = () => {
    if (!textFieldValue) {
      setErrorMessage(ErrorMessage.EMPTY_TITLE);
      setTimeout(() => {
        setErrorMessage(ErrorMessage.NONE);
      }, 3000);

      return;
    }

    addTodo();
  };

  const visibleTodos = getVisibleTodos(todos, filterStatus);
  const completedCount = getVisibleTodos(todos, 'Completed').length;
  const remainTodos = todos.length - completedCount;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmit}
          textFieldValue={textFieldValue}
          handleTextFieldValue={handletextFieldValue}
          isDisabled={isInputDisabled}
          onUpdateAll={updateAll}
          isButtonActive={completedCount === todos.length}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={deleteTodo}
          loadingTodosIDs={loadingTodosIDs}
          onUpdate={updateTodo}
        />

        {todos.length > 0 && (
          <Footer
            status={filterStatus}
            onStatusChange={setFilterStatus}
            remainTodos={remainTodos}
            completedTodos={completedCount}
            onClearAll={deleteCompleted}
          />
        )}
      </div>

      <Notification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.NONE)}
      />

    </div>
  );
};
