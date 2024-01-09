import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  getTodos,
  addTodo,
  deleteTodo,
  editTodo,
} from '../../api/todos';
import { useAuth } from '../../Context/Context';
import { Header } from '../Header';
import { TodoItem } from '../TodoItem';
import { filteredData } from '../../helpers/filteredData';
import { FilterBy, ErrorMessage } from '../../types/types';
import { Error } from '../Error';
import { Footer } from '../Footer';

export const TodoAppContent: React.FC = () => {
  const userId = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [todosCount, setTodosCount] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadTodosIds, setLoadTodosIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [disabledClear, setDisabledClear] = useState(true);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const currentTodos = filteredData<Todo>(todos, filterBy);

  const countOfNotCompleted = todos
    .filter(({ completed }) => !completed);

  const countOfCompleted = todos.filter(({ completed }) => completed);

  useEffect(() => {
    if (userId) {
      getTodos(userId)
        .then((resp) => {
          setTodos(resp);
        })
        .catch(() => setErrorMessage(ErrorMessage.Load));
    }
  }, [userId]);

  useEffect(() => {
    setTodosCount(countOfNotCompleted.length);
  }, [countOfNotCompleted]);

  useMemo(() => {
    setDisabledClear(!todos.some(({ completed }) => completed));
  }, [todos]);

  const handleAddTodo = (value: string): Promise<void> => {
    if (!userId) {
      return Promise.resolve();
    }

    if (!value.trim()) {
      setErrorMessage(ErrorMessage.NotBeEmpty);

      return Promise.resolve();
    }

    const body = {
      id: 0,
      title: value.replace(/\s+/g, ' ').trim(),
      userId,
      completed: false,
    };

    setIsAdding(true);
    setTempTodo(body);

    return addTodo(body)
      .then((resp) => {
        setTodos((todosPrev) => [...todosPrev, resp]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (idToDelete: number) => {
    setLoadTodosIds(loadTodosIdsPrev => [...loadTodosIdsPrev, idToDelete]);

    deleteTodo(idToDelete)
      .then(() => {
        setTodos(todosPrev => todosPrev.filter(({ id }) => id !== idToDelete));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadTodosIds(loadTodosIdsPrev => loadTodosIdsPrev
          .filter(loadTodoId => loadTodoId !== idToDelete));
      });
  };

  const handleEditTodo = (id: number, field: Partial<Todo>) => {
    if (field.title?.length === 0) {
      handleDeleteTodo(id);

      return;
    }

    const currentIndex = todos.findIndex(todo => todo.id === id);

    setLoadTodosIds(loadTodosIdsPrev => [...loadTodosIdsPrev, id]);

    editTodo(id, field)
      .then(resp => {
        setTodos(todosPrev => todosPrev.map((todo, index) => {
          if (currentIndex === index) {
            return resp;
          }

          return todo;
        }));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        setLoadTodosIds(loadTodosIdsPrev => loadTodosIdsPrev
          .filter(loadTodoId => (
            loadTodoId !== id
          )));
      });
  };

  const handleToggleAll = () => {
    const completedsTodos = (todosCount === 0);
    const todosToToggle = completedsTodos
      ? countOfCompleted
      : countOfNotCompleted;

    const fieldCompleted = {
      completed: !completedsTodos,
    };

    todosToToggle.forEach(({ id }) => handleEditTodo(id, fieldCompleted));
  };

  const handleClearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        handleDeleteTodo(id);
      }
    });
  };

  return (
    <>
      <div className="todoapp__content">
        <Header
          showFocus={isAdding}
          showToggle={todos.length > 0}
          itemCount={todosCount}
          onClickToggle={handleToggleAll}
          submitForm={handleAddTodo}
        />

        {currentTodos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {currentTodos.map(todo => (
              <TodoItem
                todo={todo}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
                isLoading={loadTodosIds.includes(todo.id)}
                key={todo.id}
              />
            ))}

            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                isLoading
              />
            )}
          </section>
        )}

        {((todos.length > 0) || isAdding) && (
          <Footer
            itemsCount={todosCount}
            getFilter={setFilterBy}
            clearBtnOnClick={handleClearCompleted}
            clearBtnDisabled={disabledClear}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </>
  );
};
