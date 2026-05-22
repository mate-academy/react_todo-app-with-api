import { Todo, TodoStatus, TodoStatusMap, TodoUpdate } from '../types/Todo';
import { useCallback, useMemo, useState } from 'react';
import {
  getTodos,
  createTodo,
  deleteTodo as apiDeleteTodo,
  updateTodo as apiUpdateTodo,
} from '../api/todos';

export function useTodo(initialValue: Todo[] = []) {
  const [todoList, setTodoList] = useState(initialValue);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [filterCompleted, setFilterCompleted] = useState<TodoStatus>(
    TodoStatusMap.All,
  );

  const completedList = useMemo(
    () => todoList.filter(todo => todo.completed),
    [todoList],
  );

  const activeList = useMemo(
    () => todoList.filter(todo => !todo.completed),
    [todoList],
  );

  const todos = useMemo(() => {
    switch (filterCompleted) {
      case TodoStatusMap.Active:
        return activeList;
      case TodoStatusMap.Completed:
        return completedList;
      default:
        return todoList;
    }
  }, [activeList, completedList, filterCompleted, todoList]);

  const todosCount = useMemo(() => todoList.length, [todoList.length]);
  const activeTodosCount = todoList.length - completedList.length;
  const completedTodosCount = completedList.length;
  const isAllCompleted = completedTodosCount === todosCount;

  function loadingAddTodos(ids: Todo['id'][] = []) {
    if (ids.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => [
      ...prev,
      ...ids.filter(id => !prev.includes(id)),
    ]);
  }

  function loadingRemoveTodos(ids: Todo['id'][] = []) {
    if (ids.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => prev.filter(id => !ids.includes(id)));
  }

  const getTodoList = useCallback(async () => {
    return getTodos()
      .then(response => setTodoList(response))
      .catch(() => {
        throw new Error('Unable to load todos');
      });
  }, []);

  const addTodo = useCallback(async (title: Todo['title']) => {
    return createTodo(title)
      .then(response => setTodoList(prevState => [...prevState, response]))
      .catch(() => {
        throw new Error('Unable to add a todo');
      });
  }, []);

  const deleteTodo = useCallback(async (id: Todo['id']) => {
    loadingAddTodos([id]);

    return apiDeleteTodo(id)
      .then(() =>
        setTodoList(prevState => prevState.filter(todo => todo.id !== id)),
      )
      .catch(() => {
        throw new Error('Unable to delete a todo');
      })
      .finally(() => loadingRemoveTodos([id]));
  }, []);

  const deleteCompletedTodos = useCallback(async () => {
    const idsToDelete = completedList.map(todo => todo.id);

    loadingAddTodos(idsToDelete);

    try {
      const results = await Promise.allSettled(idsToDelete.map(apiDeleteTodo));
      const deletedIds = idsToDelete.filter(
        (_id, index) => results[index].status === 'fulfilled',
      );

      setTodoList(prevState =>
        prevState.filter(todo => !deletedIds.includes(todo.id)),
      );

      const hasError = idsToDelete.length !== deletedIds.length;

      if (hasError) {
        throw new Error('Unable to delete a todo');
      }
    } finally {
      loadingRemoveTodos(idsToDelete);
    }
  }, [completedList]);

  const updateTodo = useCallback(async (id: Todo['id'], values: TodoUpdate) => {
    loadingAddTodos([id]);

    return apiUpdateTodo(id, values)
      .then(response =>
        setTodoList(prevState =>
          prevState.map(todo => (todo.id === id ? response : todo)),
        ),
      )
      .catch(() => {
        throw new Error('Unable to update a todo');
      })
      .finally(() => loadingRemoveTodos([id]));
  }, []);

  const updateTodoCompletedField = useCallback(
    async (value: Todo['completed']) => {
      const list = value ? [...activeList] : [...completedList];
      const idsToUpdate = list.map(todo => todo.id);

      loadingAddTodos(idsToUpdate);

      try {
        const results = await Promise.allSettled(
          idsToUpdate.map(id => {
            return apiUpdateTodo(id, { completed: value });
          }),
        );

        const updatedTodos = results
          .filter(
            (result): result is PromiseFulfilledResult<Todo> =>
              result.status === 'fulfilled',
          )
          .map(result => result.value);

        setTodoList(prevState =>
          prevState.map(todo => {
            const newTodo = updatedTodos.find(item => item.id === todo.id);

            return newTodo || todo;
          }),
        );

        const hasError = results.some(result => result.status === 'rejected');

        if (hasError) {
          throw new Error('Unable to update a todo');
        }
      } finally {
        loadingRemoveTodos(idsToUpdate);
      }
    },
    [activeList, completedList],
  );

  return {
    todos,
    todosCount,
    loadingTodoIds,
    activeTodosCount,
    completedTodosCount,
    filterCompleted,
    isAllCompleted,
    setFilterCompleted,
    getTodoList,
    addTodo,
    deleteTodo,
    deleteCompletedTodos,
    updateTodo,
    updateTodoCompletedField,
  };
}
