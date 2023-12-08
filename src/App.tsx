/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { Todo } from './types/Todo';
import { getTodos, removeTodo, updateTodo } from './api/todos';
import { TodoItem } from './components/TodoItem';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

const USER_ID = 12004;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[] | null>(null);
  const [query, setQuery] = useState<FilterType>(FilterType.All);
  const [errorText, setErrorText] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [listToOperation, setListToOperation] = useState<number[]>([]);
  const [delited, setDelited] = useState<number>(0);

  const getTodosList = async () => {
    try {
      const tmp = await getTodos(USER_ID);

      setTodos(tmp);
      setFilteredTodos(tmp);
    } catch (error) {
      setErrorText(ErrorType.Load);
    }
  };

  useEffect(() => {
    getTodosList();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorText(null);
    }, 3000);
  }, [errorText]);

  useEffect(() => {
    if (todos) {
      switch (query) {
        case FilterType.Active:
          setFilteredTodos(todos.filter((el) => !el.completed));
          break;
        case FilterType.Completed:
          setFilteredTodos(todos.filter((el) => el.completed));
          break;
        default:
          setFilteredTodos(todos);
          break;
      }
    }
  }, [query, todos]);

  const leftItems = (): number => {
    if (todos) {
      const tmp = todos.filter((el) => !el.completed);

      return tmp.length;
    }

    return -1;
  };

  const items = (): number => {
    return todos?.length ?? 0;
  };

  const saveResponse = (response: Todo) => {
    setTodos((prev) => [...prev ?? [], response]);
  };

  const removeOnResponse = (id: number) => {
    const tmp = todos?.filter((el) => el.id !== id);

    if (tmp) {
      setTodos(() => tmp);
    }
  };

  const updateOnResponse = (todo: Todo) => {
    const tmp = todos?.map((el) => {
      if (el.id === todo.id) {
        return todo;
      }

      return el;
    });

    if (tmp) {
      setTodos(() => tmp);
    }
  };

  const clearCompleted = () => {
    if (todos) {
      const list = todos.filter((el) => el.completed).map((el) => el.id);

      setListToOperation(() => list);

      const todosToRemove = list
        .map((el) => removeTodo(el)
          .then(() => el)
          .catch(() => {
            setErrorText(ErrorType.Delete);

            return null;
          }));

      Promise.all(todosToRemove).then((ids) => {
        const tmp = todos.filter((el) => !ids.includes(el.id));

        setListToOperation((prev) => prev.filter((el) => !ids.includes(el)));

        setTodos(() => tmp);
        setDelited(prev => prev + 1);
      });
    }
  };

  const setAll = () => {
    if (todos) {
      let list : Todo[] = [];

      if (leftItems() === 0) {
        list = todos.map((el) => ({ ...el, completed: false }));
      } else {
        list = todos.filter((el) => !el.completed)
          .map((el) => ({ ...el, completed: true }));
      }

      setListToOperation(() => list.map((el) => el.id));

      const todosToUpdate = list
        .map((el) => updateTodo(el)
          .then(() => el)
          .catch(() => {
            setErrorText(ErrorType.Delete);

            return null;
          }));

      Promise.all(todosToUpdate).then((listOfUpdated) => {
        const tmp = todos.map((el) => {
          const updatedTodo = listOfUpdated.find((todo) => todo?.id === el.id);

          if (updatedTodo) {
            return updatedTodo;
          }

          return el;
        });

        setListToOperation((prev) => prev
          .filter((el) => !listOfUpdated
            .some((updated => updated?.id === el))));

        setTodos(() => tmp);
        setDelited(prev => prev + 1);
      });
    }
  };

  return (

    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorText={setErrorText}
          saveResponse={saveResponse}
          setTempTodo={setTempTodo}
          leftItems={leftItems}
          items={items}
          delited={delited}
          setAll={setAll}
        />
        {filteredTodos && (
          <TodoList
            todos={filteredTodos}
            setErrorText={setErrorText}
            removeOnResponse={removeOnResponse}
            listToOperation={listToOperation}
            setDelited={setDelited}
            updateOnResponse={updateOnResponse}
          />
        )}

        {tempTodo && (<TodoItem todo={tempTodo} />)}

        {todos && todos?.length > 0 && (
          <Footer
            setQuery={setQuery}
            items={items}
            leftItems={leftItems}
            query={query}
            clearCompleted={clearCompleted}
          />
        )}
        <ErrorMessage errorText={errorText} setErrorText={setErrorText} />

      </div>
    </div>
  );
};
