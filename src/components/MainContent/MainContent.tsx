import { FC, useEffect, useState } from 'react';
import cn from 'classnames';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import {
  addTodo, deleteTodo,
  editTodo, getTodos,
} from '../../api/todos';
import { CreateTodoForm } from '../CreateTodoForm';
import { ToggleTodosCompleted } from '../ToggleTodosCompleted';
import { Filter } from '../Filter';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { User } from '../../types/User';
import { TodoForServer } from '../../types/TodoForServer';

type Props = {
  user: User;
  setError: (error: string) => void;
};

export const MainContent: FC<Props> = ({ user, setError }) => {
  // Filter
  const {
    ALL,
    ACTIVE,
    COMPLETED,
  } = FilterType;
  const [currentFilter, setCurrentFilter] = useState<FilterType>(ALL);

  const filterList = [ALL, ACTIVE, COMPLETED];

  const changeCurrentFilter = (filterType: FilterType) => {
    setCurrentFilter(filterType);
  };

  // Loading Todos
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const addOnLoadingTodo = (id: number) => {
    setLoadingTodos(currentTodos => [...currentTodos, id]);
  };

  const deleteFromLoadingTodo = (id: number) => {
    setLoadingTodos(currentTodos => (
      [...currentTodos.filter(todoId => todoId !== id)]
    ));
  };

  // Is adding
  const [isTodoAdding, setIsTodoAdding] = useState(false);

  // Todos
  const [todos, setTodos] = useState<Todo[]>([]);

  const filteredTodos = (): Todo[] => {
    switch (currentFilter) {
      case ACTIVE:
        return todos.filter(todo => !todo.completed);
      case COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  const isAllTodosCompleted = completedTodos.length === todos.length;
  const isToggleVisible = completedTodos.length === todos.length
    && todos.length > 0;

  // Temp todos
  const [tempTodo, setTempTodo] = useState<TodoForServer | null>();

  const addTempTodo = (title: string) => {
    const isValidTempTodo = title.trim().length;
    const isTodoUnique = todos.filter(todo => (
      todo.title === title
    )).length === 0;

    if (isValidTempTodo && isTodoUnique) {
      const newTempTodo = {
        userId: user.id,
        title,
        completed: false,
      };

      setIsTodoAdding(true);
      setTempTodo(newTempTodo);
      setTodos(currentTodos => [...currentTodos, { ...newTempTodo, id: 0 }]);
      addOnLoadingTodo(0);
    } else {
      setError('Can\'t add new todo');
    }
  };

  // Server actions
  const loadTodosFromServer = async () => {
    try {
      setTodos(await getTodos(user.id));
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error', error.message);
      setError('Can\'t load todos');
    }
  };

  const addNewTodoOnServer = async (newTodo: TodoForServer) => {
    try {
      await addTodo(user.id, newTodo);
      await loadTodosFromServer();
      setTempTodo(null);
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error', error.message);
      setError('Unable to add a todo');
    }
  };

  const deleteTodoOnServer = async (id: number) => {
    try {
      addOnLoadingTodo(id);
      await deleteTodo(id);
      await loadTodosFromServer();
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error', error.message);
      setError('Unable to delete a todo');
    }
  };

  const changeTodoOnServer = async (
    id: number,
    todo: Partial<Todo>,
  ) => {
    try {
      addOnLoadingTodo(id);
      await editTodo(id, todo);
      await loadTodosFromServer();
      deleteFromLoadingTodo(id);
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error', error.message);
      setError('Unable to update a todo');
    }
  };

  const changeCompletedForGroup = async (group: Todo[], value: boolean) => {
    await Promise.all(
      group.map(todo => {
        addOnLoadingTodo(todo.id);

        return editTodo(todo.id, { completed: value });
      }),
    );
    await loadTodosFromServer();
    todos.forEach(todo => deleteFromLoadingTodo(todo.id));
  };

  const setAllTodosCompletedOnServer = async () => {
    try {
      if (isAllTodosCompleted) {
        await changeCompletedForGroup(completedTodos, false);
      } else {
        await changeCompletedForGroup(activeTodos, true);
      }
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error', error.message);
      setError('Can\'t change todos');
    }
  };

  const deleteAllCompletedTodos = async () => {
    try {
      await Promise.all(
        completedTodos.map(todo => deleteTodoOnServer(todo.id)),
      );
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('error', error.message);
      setError('Can\'t delete todos');
    }
  };

  // Key generator
  const generateKey = (prev: string) => {
    return `${prev}_${new Date().getTime()}`;
  };

  // Effects
  useEffect(() => {
    loadTodosFromServer();
  }, []);

  useEffect(() => {
    if (tempTodo) {
      addNewTodoOnServer(tempTodo);
      setIsTodoAdding(false);
    }
  }, [tempTodo]);

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        <ToggleTodosCompleted
          setTodosCompleted={setAllTodosCompletedOnServer}
          isToggleVisible={isToggleVisible}
        />

        <CreateTodoForm
          addNewTodo={addTempTodo}
          isTodoAdding={isTodoAdding}
        />
      </header>

      <section className="todoapp__main" data-cy="TodoItem">
        <TransitionGroup>
          {filteredTodos().map(todo => {
            return (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  deleteTodo={deleteTodoOnServer}
                  isLoadingTodo={loadingTodos.includes(todo.id)}
                  changeTodoOnServer={changeTodoOnServer}
                />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </section>

      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${activeTodos.length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            {filterList.map((filter) => {
              const newKey = generateKey(filter);

              return (
                <Filter
                  key={newKey}
                  filter={filter}
                  currentFilter={currentFilter}
                  selectFilter={changeCurrentFilter}
                />
              );
            })}
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className={cn({
              'todoapp__clear-completed': isAllTodosCompleted,
              'todoapp__hide-completed': !isAllTodosCompleted,
            })}
            onClick={deleteAllCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </div>
  );
};
