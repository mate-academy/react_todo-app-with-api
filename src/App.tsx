import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoAppHeader } from './components/TodoAppHeader/TodoAppHeader';
import { TodoAppContent } from './components/TodoAppContent/TodoAppContent';
import { TodoAppFooter } from './components/TodoAppFooter/TodoAppFooter';
import { Notifications } from './components/Notifications/Notifications';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';
import { TodoPostData } from './types/TodoPostData';
import { TodoListContext } from './context/TodoListContext';

const USER_ID = 10308;

const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);
const postTodo = (data: TodoPostData) => client.post<Todo>(`/todos?userId=${USER_ID}`, data);
const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);
const changeTodo = (todoId: number, data: TodoPostData) => client.patch<Todo>(`/todos/${todoId}`, data);

const prepareTodos = (todoList: Todo[], filterType: FilterType) => (
  todoList.filter(todo => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return !todo.completed;

      case FilterType.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  })
);

const getActiveTodosCount = (todoList: Todo[]) => (
  todoList.filter(todo => !todo.completed).length
);

export const App = () => {
  const [todoList, setTodoList] = useState<Todo[] | null>(null);

  const {
    todoInputValue,
    setTodoInputValue,
    setTempTodo,
    filterType,
    setDeletedId,
    setEditedId,
    setareAllEdited,
    setCompletedDel,
    setIsInputDisabled,
    setIsErrorShown,
    setErrorType,
  } = useContext(TodoListContext);

  const getTodoList = useCallback(async () => {
    const todos = await getTodos();

    setTodoList(todos);
  }, []);

  const preparedTodos = useMemo(() => (
    prepareTodos(todoList || [], filterType)
  ), [todoList, filterType]);

  const activeTodosCount = useMemo(() => (
    getActiveTodosCount(todoList || [])
  ), [todoList]);

  const isToggleAllActive = useMemo(() => (
    !!todoList && todoList.every(todo => todo.completed === true)
  ), [todoList]);

  const areCompletedTodos = todoList
    ? activeTodosCount < todoList.length
    : false;

  const handleTodoInputChange = (value: string) => {
    setIsErrorShown(false);

    setTodoInputValue(value);
  };

  const executePostTodo = async () => {
    const postedTodo = {
      title: todoInputValue,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...postedTodo,
    });

    try {
      const {
        id,
        title,
        userId,
        completed,
      } = await postTodo(postedTodo);

      const newTodo = {
        id,
        title,
        userId,
        completed,
      };

      setTodoList(currentList => (
        currentList
          ? [...currentList, newTodo]
          : [newTodo]
      ));
    } catch {
      setErrorType(ErrorType.ADD);
      setIsErrorShown(true);
    } finally {
      setTempTodo(null);
    }
  };

  const handleAddTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoInputValue.trim().length === 0) {
      setIsErrorShown(true);
      setErrorType(ErrorType.TITLE);

      return;
    }

    setIsInputDisabled(true);
    await executePostTodo();
    setIsInputDisabled(false);
    setTodoInputValue('');
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedId(todoId);

    try {
      await deleteTodo(todoId);

      const newList = todoList && todoList.filter(({ id }) => todoId !== id);

      setTodoList(newList);
    } catch {
      setErrorType(ErrorType.DELETE);
      setIsErrorShown(true);
    } finally {
      setDeletedId(null);
    }
  };

  const handleDeleteCompleted = async () => {
    if (!todoList) {
      return;
    }

    setCompletedDel(true);

    const completedTodos = prepareTodos(todoList, FilterType.COMPLETED);
    const lastTodo = completedTodos.splice(completedTodos.length - 1, 1)[0];

    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });

    try {
      await deleteTodo(lastTodo.id);

      const newList = todoList.filter(({ completed }) => completed === false);

      setTodoList(newList);
    } catch {
      setErrorType(ErrorType.DELETE);
      setIsErrorShown(true);
    } finally {
      setCompletedDel(false);
    }
  };

  const toggleTodoStatus = async (todoId: number, isCompleted: boolean) => {
    await changeTodo(todoId, { completed: !isCompleted });
  };

  const handleTodoStatusToggle = async (
    todoId: number,
    isCompleted: boolean,
  ) => {
    setEditedId(todoId);

    try {
      await toggleTodoStatus(todoId, isCompleted);
      setTodoList(currentList => (
        currentList && currentList.map(todo => {
          if (todo.id === todoId) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        })
      ));
    } catch {
      setErrorType(ErrorType.EDIT);
      setIsErrorShown(true);
    }

    setEditedId(null);
  };

  const handleToggleAll = async () => {
    if (!todoList) {
      return;
    }

    setareAllEdited(true);

    const patchedTodos = todoList.filter(todo => (
      todo.completed === isToggleAllActive
    ));

    const patchedIds = patchedTodos.map(todo => todo.id);

    const patchedIdsNoLast = [...patchedIds];
    const lastPatchedId = patchedIdsNoLast.splice(patchedIds.length - 1, 1)[0];

    patchedIdsNoLast.forEach(toggledTodoId => {
      toggleTodoStatus(toggledTodoId, isToggleAllActive);
    });
    try {
      await toggleTodoStatus(lastPatchedId, isToggleAllActive);

      setTodoList(currentList => (
        currentList && currentList.map(todo => {
          if (patchedIds.includes(todo.id)) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        })
      ));
    } catch {
      setErrorType(ErrorType.EDIT);
      setIsErrorShown(true);
    }

    setareAllEdited(false);
  };

  const handleTitleChange = async (todoId: number, newTitle: string) => {
    setEditedId(todoId);

    try {
      await changeTodo(todoId, { title: newTitle });
      setTodoList(currentList => (
        currentList && currentList.map(todo => {
          if (todo.id === todoId) {
            return {
              ...todo,
              title: newTitle,
            };
          }

          return todo;
        })
      ));
    } catch {
      setErrorType(ErrorType.EDIT);
      setIsErrorShown(true);
    }

    setEditedId(null);
  };

  useEffect(() => {
    getTodoList();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoAppHeader
          isToggleAllActive={isToggleAllActive}
          onInputChange={handleTodoInputChange}
          onSubmit={handleAddTodo}
          onToggleAll={handleToggleAll}
        />

        {preparedTodos && (
          <>
            <TodoAppContent
              todoList={preparedTodos}
              onDelete={handleDeleteTodo}
              onCompletedToggle={handleTodoStatusToggle}
              onTitleChange={handleTitleChange}
            />

            <TodoAppFooter
              filterType={filterType}
              activeTodosCount={activeTodosCount}
              areCompletedTodos={areCompletedTodos}
              onDeleteCompleted={handleDeleteCompleted}
            />
          </>
        )}
      </div>

      <Notifications />
    </div>
  );
};
