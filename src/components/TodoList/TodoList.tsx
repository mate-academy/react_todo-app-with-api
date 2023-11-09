import React, { useEffect, useRef, useState } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import {
  changeTodoTitle,
  deleteTodo,
  getTodos,
  postTodo,
  toggleCompleteTodo,
} from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Header } from './Header';
import { Footer } from './Footer';
import { TodoItem } from './TodoItem';
import { FilterType } from '../../types/FilterType';
import { ErrorNotification } from './ErrorNotification';

type Props = {
  userId: number;
};

export const TodoList: React.FC<Props> = ({ userId }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [focusToInputHeader, setFocusToInputHeader] = useState(false);

  const [filteredTodo, setFilteredTodo] = useState<FilterType>(FilterType.ALL);

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  let updatedTodos = [...todos];

  switch (filteredTodo) {
    case FilterType.ALL:
      updatedTodos = todos.filter(todo => todo);
      break;
    case FilterType.ACTIVE:
      updatedTodos = todos.filter(todo => !todo.completed);
      break;
    case FilterType.COMPLETED:
      updatedTodos = todos.filter(todo => todo.completed);
      break;
    default: updatedTodos = todos;
  }

  const todosQty = todos.filter(todo => todo.completed !== true).length;

  const errorTimerId = useRef(0);
  const showErrorMessage = () => {
    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    showErrorMessage();
  }, [errorMessage]);

  const handleCreateTodoSubmit = (
    todoTitle: string,
    setIsInputDisabled: (value: boolean) => void,
    setTodoTitle: (value: string) => void,
  ) => {
    if (!todoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: todoTitle.trim(),
      userId,
      completed: false,
    });

    setIsInputDisabled(true);

    postTodo({
      title: todoTitle.trim(),
      userId,
      completed: false,
    })
      .then(newTodo => {
        // setTodos([...todos, newTodo]);
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setLoading(true);
    setFocusToInputHeader(false);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
        setFocusToInputHeader(true);
      });
  };

  const handleCompleteTodo = (todoId: number, completed: boolean) => {
    setLoading(true);
    toggleCompleteTodo(todoId, completed)
      .then(() => {
        setTodos(currentTodos => currentTodos.map(todo => (todo.id === todoId
          ? { ...todo, completed }
          : todo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to complete a todo');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeTodoTitle = (todoId: number, newTitle: string) => {
    setLoading(true);
    changeTodoTitle(todoId, newTitle)
      .then(() => {
        setTodos(todos.map(todo => (todo.id === todoId
          ? { ...todo, title: newTitle }
          : todo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleToggleAll = () => {
    const isAllTodosCompleted = todos.every(todo => todo.completed);

    if (isAllTodosCompleted) {
      todos.forEach(todo => {
        handleCompleteTodo(todo.id, false);
      });
    } else {
      todos.forEach(todo => {
        if (todo.completed === false) {
          handleCompleteTodo(todo.id, true);
        }
      });
    }
  };

  // const handleClearCompleted = () => {
  //   todos
  //     .filter(todo => todo.completed)
  //     .map(todo => handleDeleteTodo(todo.id));
  // };

  const handleClearCompleted = async () => {
    const allCompleted = todos.filter(todo => todo.completed);

    await Promise.allSettled(allCompleted
      .map(todo => handleDeleteTodo(todo.id)));
  };

  return (
    <>
      <div className="todoapp__content">
        <section className="todoapp__main" data-cy="TodoList">
          <Header
            todosLength={todos.length}
            handleCreateTodoSubmit={handleCreateTodoSubmit}
            handleToggleAll={handleToggleAll}
            isAllTodoCompleted={todosQty === 0}
            focusToInputHeader={focusToInputHeader}
          />
          <TransitionGroup>
            { updatedTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  key={todo.id}
                  isLoading={loading}
                  handleDeleteTodo={handleDeleteTodo}
                  handleCompleteTodo={handleCompleteTodo}
                  handleChangeTodoTitle={handleChangeTodoTitle}
                />
              </CSSTransition>
            ))}

            { tempTodo && (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem
                  todo={tempTodo}
                  isLoading
                  handleDeleteTodo={handleDeleteTodo}
                  handleCompleteTodo={handleCompleteTodo}
                  handleChangeTodoTitle={handleChangeTodoTitle}
                />
              </CSSTransition>
            )}

            { todos.length > 0 && (
              <Footer
                todosQty={todosQty}
                filterTodo={setFilteredTodo}
                selectedTodoFilter={filteredTodo}
                handleClearCompleted={handleClearCompleted}
                hasCompletedTodos={
                  todos.filter(todo => todo.completed).length > 0
                }
              />
            )}
          </TransitionGroup>
        </section>
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </>

  );
};
