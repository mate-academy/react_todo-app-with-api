import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { UserWarning } from "./UserWarning";
import { getTodos, postTodo, deleteTodo, patchTodo } from "./api/todos";
import { TodoInterface } from "./types/Todo";
import { TodoList } from "./Components/TodoList/TodoList";
import { Error } from "./Components/Error/Error";
import { FilterTodo } from "./Components/FilterTodo/FilterTodo";
import { FilterStatus } from "./types/FilterStatus";
import { Header } from "./Components/Header/Header";
import classNames from "classnames";

const USER_ID = 6429;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoInterface[]>([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [temporaryTodo, setTemporaryTodo] = useState<TodoInterface>();
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [toggle, setToggle] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.all);
  const activeTodosСount = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  useEffect(() => {
    if (activeTodosСount === 0) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [activeTodosСount]);

  const completedTodos = useMemo(() => {
    return todos.filter(({ completed }) => completed);
  }, [todos]);

  const resetError = () => {
    const timeoutID = setTimeout(() => setError(""), 3000);

    return () => {
      clearTimeout(timeoutID);
    };
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((result: React.SetStateAction<TodoInterface[]>) => setTodos(result))
      .catch(() => setError("Unable to load the todos"));
  }, []);

  const currentTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filter) {
        case FilterStatus.active:
          return !todo.completed;

        case FilterStatus.completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (todoTitle: string) => {
    const newTodo = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTemporaryTodo({ ...newTodo, id: 0 });

    postTodo(USER_ID, newTodo)
      .then((result: TodoInterface) => {
        setTodos((state) => [...state, result]);
      })
      .catch(() => {
        setError("Unable to add a todo");
        resetError();
      })
      .finally(() => {
        setTemporaryTodo(undefined);
      });
  };

  const removeTodo = async (id: number) => {
    try {
      setLoadingIds((state) => [...state, id]);
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch {
      setError("Unable to delete a todo");
      resetError();
    } finally {
      setLoadingIds([]);
    }
  };

  const handleUpdate = async (id: number, data: Partial<TodoInterface>) => {
    setLoadingIds((state) => [...state, id]);

    try {
      await patchTodo(id, data);

      setTodos((state) =>
        state.map((todo) => {
          if (todo.id === id) {
            return { ...todo, ...data };
          }

          return todo;
        })
      );
    } catch {
      setError("Unable to update a todo");
      resetError();
    } finally {
      setLoadingIds((state) => state.filter((el) => el !== id));
    }
  };

  const onDeleteComplete = () => {
    const FilterCompletedTodos = todos.filter((todo) => todo.completed);

    FilterCompletedTodos.map(async (todo) => {
      try {
        await deleteTodo(todo.id);
        setTodos(todos.filter((task) => !task.completed));
      } catch {
        setError("Unable to remove todo");
        resetError();
      }
    });
  };

  const toggleAllCompleted = () => {
    const allCompleted = todos.every((todo) => todo.completed);
    setToggle((state) => !state);

    if (allCompleted) {
      todos.map((todoEl) => {
        return handleUpdate(todoEl.id, { completed: false });
      });
    } else {
      const notCompleted = todos.filter((el) => !el.completed);

      notCompleted.map((todoElement) => {
        return handleUpdate(todoElement.id, { completed: true });
      });
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title || title.trim() === "") {
      setError("Tittle can not be empty");
      resetError();

      return;
    }

    addTodo(title);
    setTitle("");
  };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmitForm={handleSubmit}
          title={title}
          onChangeTitle={changeHandler}
          onToggleAllCompleted={toggleAllCompleted}
          count={todos.length}
          toggle={toggle}
        />

        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              <TodoList
                todos={currentTodos}
                onDeleteTodo={removeTodo}
                temporaryTodo={temporaryTodo}
                onUpdateTodo={handleUpdate}
                loadingIds={loadingIds}
              />
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">{`${activeTodosСount}  items left`}</span>

              <FilterTodo filter={filter} onFilterChange={setFilter} />

              <button
                type="button"
                className={classNames("todoapp__clear-completed", {
                  visible: completedTodos.length,
                })}
                onClick={onDeleteComplete}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {error && <Error error={error} onClear={() => setError("")} />}
    </div>
  );
};
