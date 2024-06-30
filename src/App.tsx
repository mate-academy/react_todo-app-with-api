/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as todosService from './api/todos';
import { TodoType } from './types/Todo.type';
import { ErrorsEnum } from './utils/ErrorsEnum';
import { Error } from './components/Error/Error';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { FiltersEnum } from './utils/FiltersEnum';

export const App: React.FC = () => {
  const [todoList, setTodosList] = useState<TodoType[]>([]);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [error, setError] = useState<ErrorsEnum | null>(null);
  const [isAddTodoEnabled, setIsAddTodoEnabled] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FiltersEnum>(
    FiltersEnum.All,
  );

  const filteredTodoList = useMemo<TodoType[]>(() => {
    return todoList.filter(todo => {
      switch (selectedFilter) {
        case FiltersEnum.Active:
          return !todo.completed;
        case FiltersEnum.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todoList, selectedFilter]);

  const itemsLeft = useMemo(() => {
    return todoList.filter(todo => !todo.completed).length;
  }, [todoList]);

  const updateClearDisabled = useMemo(() => {
    return !todoList.some(todo => todo.completed);
  }, [todoList]);

  const isEveryTodoCompleted = useMemo(() => {
    return todoList.every(todo => todo.completed);
  }, [todoList]);

  const isToggleAllVisible = useMemo(() => {
    return todoList.length !== 0;
  }, [todoList]);

  useEffect(() => {
    setTimeout(() => setError(null), 3000);
  }, [error]);

  useEffect(() => {
    todosService
      .getTodos()
      .then(todos => {
        setTodosList(todos);
      })
      .catch(() => {
        setError(ErrorsEnum.UNABLE_LOAD_TODOS);
      });
  }, []);

  const handleDeleteTodo = (todoId: number) => {
    setIsAddTodoEnabled(false);
    todosService
      .deleteTodos(todoId)
      .then(() => {
        setTodosList(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorsEnum.UANBLE_DELETE_TODO);
      })
      .finally(() => {
        setIsAddTodoEnabled(true);
      });
  };

  const handleClearCompleted = useCallback(() => {
    todoList.map(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  }, [todoList]);

  const addTodo = () => {
    const title = inputValue.trim();

    if (title === '') {
      setError(ErrorsEnum.TITLE_IS_EMPTY);
      setIsAddTodoEnabled(true);

      return;
    }

    setTempTodo({
      id: 0,
      userId: 0,
      title: title,
      completed: false,
    });

    todosService
      .createTodos(title)
      .then(newTodo => {
        setTodosList(currentTodos => [...currentTodos, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setError(ErrorsEnum.UNABLE_ADD_TODO);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAddTodoEnabled(true);
      });
  };

  const updateTodo = (updatedTodo: TodoType) => {
    return todosService
      .updateTodos(updatedTodo)
      .then(responseTodo => {
        setTodosList(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, responseTodo);

          return newTodos;
        });

        return true;
      })
      .catch(() => {
        setError(ErrorsEnum.UNABLE_UPDATE_TODO);

        return false;
      });
  };

  const handleToggleAll = useCallback(() => {
    if (todoList.every(todo => todo.completed)) {
      todoList.map(todo => {
        const updatedTodo = { ...todo, completed: false };

        updateTodo(updatedTodo);
      });

      return;
    }

    todoList.map(todo => {
      if (todo.completed) {
        return;
      }

      const updatedTodo = { ...todo, completed: true };

      updateTodo(updatedTodo);
    });
  }, [todoList]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputValue={inputValue}
          isAddTodoEnabled={isAddTodoEnabled}
          isEveryTodoCompleted={isEveryTodoCompleted}
          createTodo={addTodo}
          setInputValue={setInputValue}
          toggleEnabled={setIsAddTodoEnabled}
          handleToggleAll={handleToggleAll}
          isToggleAllVisible={isToggleAllVisible}
        />

        <TodoList
          todoList={filteredTodoList}
          tempTodo={tempTodo}
          deleteTodo={handleDeleteTodo}
          updateTodo={updateTodo}
        />

        {todoList.length > 0 && (
          <Footer
            isClearDisabled={updateClearDisabled}
            itemsLeft={itemsLeft}
            clearCompleted={handleClearCompleted}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
          />
        )}
      </div>

      <Error error={error} clearError={setError} />
    </div>
  );
};
