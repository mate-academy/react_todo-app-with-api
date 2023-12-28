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
} from '../api/todos';
import { Todo } from '../types/Todo';
import { Header } from './TodoList/Header';
import { Footer } from './TodoList/Footer';
import { TodoItem } from './TodoList/TodoItem';
import { FilterType } from '../types/FilterType';
import { ErrorNotification } from './TodoList/ErrorNotification';

type Props = {
  userId: number;
};

export const TodoList: React.FC<Props> = ({ userId }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filteredTodo, setFilteredTodo] = useState<FilterType>(FilterType.ALL);
  const [updatedTodos, setUpdatedTodos] = useState<Todo[]>([]);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [focusToHeaderInput, setFocusToHeaderInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        setProcessingTodoIds([]);
      });
  }, [userId]);

  useEffect(() => {
    switch (filteredTodo) {
      case FilterType.ALL:
        setUpdatedTodos(todos.filter(todo => todo));
        break;
      case FilterType.ACTIVE:
        setUpdatedTodos(todos.filter(todo => !todo.completed));
        break;
      case FilterType.COMPLETED:
        setUpdatedTodos(todos.filter(todo => todo.completed));
        break;
      default: setUpdatedTodos(todos);
    }
  }, [filteredTodo, todos]);

  const todosQty = todos.filter(todo => !todo.completed).length;

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

  const handleCreateTodo = (
    event: React.FormEvent,
    todoTitle: string,
    setIsInputDisabled: (value: boolean) => void,
    setTodoTitle: (value: string) => void,
  ) => {
    event.preventDefault();
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
    setProcessingTodoIds(currentTodoIds => [...currentTodoIds, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(currentTodo => currentTodo.id !== id));
        setFocusToHeaderInput(currentState => !currentState);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingTodoIds(
          currentTodoIds => currentTodoIds
            .filter(currentTodoId => currentTodoId !== id),
        );
      });
  };

  const handleCompleteTodo = (todoId: number, completed: boolean) => {
    setProcessingTodoIds(currentTodoIds => [...currentTodoIds, todoId]);

    return toggleCompleteTodo(todoId, completed)
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
        setProcessingTodoIds(
          currentTodoIds => currentTodoIds
            .filter(currentTodoId => currentTodoId !== todoId),
        );
      });
  };

  const handleChangeTodoTitle = (todoId: number, newTitle: string) => {
    setProcessingTodoIds(currentTodoIds => [...currentTodoIds, todoId]);

    return changeTodoTitle(todoId, newTitle)
      .then(() => {
        setTodos(todos.map(todo => (todo.id === todoId
          ? { ...todo, title: newTitle }
          : todo
        )));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');

        throw new Error('Error: Unable to update a todo');
      })
      .finally(() => {
        setProcessingTodoIds(
          currentTodoIds => currentTodoIds
            .filter(currentTodoId => currentTodoId !== todoId),
        );
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
        if (!todo.completed) {
          handleCompleteTodo(todo.id, true);
        }
      });
    }
  };

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
            handleCreateTodo={handleCreateTodo}
            handleToggleAll={handleToggleAll}
            isAllTodoCompleted={todosQty === 0}
            focusToHeaderInput={focusToHeaderInput}
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
                  isLoading={processingTodoIds.includes(todo.id)}
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
                />
              </CSSTransition>
            )}
          </TransitionGroup>

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
        </section>
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </>

  );
};
