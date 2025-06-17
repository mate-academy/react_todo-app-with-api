import { useEffect, useState } from 'react';
import { getTodos, addTodo, deleteTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoTypeError, TodoTypeErrors } from '../../types/TodoTypeErrors';
import { USER_ID } from '../../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TodoTypeError | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoID, setProcessingTodoID] = useState<number[]>([]);

  // get todos
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(TodoTypeErrors.UnableToLoad);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // add todo and validate
  const add = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(TodoTypeErrors.TitleShouldNotBeEmpty);

      return false;
    }

    setIsLoading(true);
    setError(null);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await addTodo(trimmedTitle);

      setTodos(prev => [...prev, newTodo]);
      setTempTodo(null);

      return true;
    } catch {
      setError(TodoTypeErrors.UnableToAddTodo);
      setTempTodo(null);

      return false;
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  // delete todo and validate
  const remove = async (todoId: number) => {
    setProcessingTodoID(id => [...id, todoId]);
    setIsLoading(true);
    setError(null);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(TodoTypeErrors.UnableToDeleteTodo);
      throw new Error(TodoTypeErrors.UnableToDeleteTodo);
    } finally {
      setProcessingTodoID(prevIds => prevIds.filter(id => id !== todoId));
      setIsLoading(false);
    }
  };

  // toggle todo and validate
  const toggle = async (todo: Todo) => {
    setProcessingTodoID(ids => [...ids, todo.id]);
    setIsLoading(true);
    setError(null);
    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    } catch {
      setError(TodoTypeErrors.UnableToUpdateTodo);
      throw new Error(TodoTypeErrors.UnableToUpdateTodo);
    } finally {
      setProcessingTodoID(ids => ids.filter(id => id !== todo.id));
      setIsLoading(false);
    }
  };

  // remove all completed todo
  const removeCompleted = async () => {
    setIsLoading(true);
    setError(null);

    const completedTodos = todos.filter(todo => todo.completed);

    setProcessingTodoID(prev => [
      ...prev,
      ...completedTodos.map(todo => todo.id),
    ]);

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);
            setTodos(prev => prev.filter(t => t.id !== todo.id));
          } catch {
            setError(TodoTypeErrors.UnableToDeleteTodo);
          } finally {
            setProcessingTodoID(prev => prev.filter(id => id !== todo.id));
          }
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // toggle all status
  const toggleAll = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newCompleted = !areAllCompleted;
    const toUpdate = todos.filter(todo => todo.completed !== newCompleted);

    setProcessingTodoID(prev => [...prev, ...toUpdate.map(t => t.id)]);
    setIsLoading(true);

    try {
      const updatedTodos = await Promise.all(
        toUpdate.map(todo =>
          updateTodo(todo.id, { ...todo, completed: newCompleted }),
        ),
      );

      setTodos(prev =>
        prev.map(todo => {
          const updated = updatedTodos.find(t => t.id === todo.id);

          return updated ? updated : todo;
        }),
      );
    } catch {
      setError(TodoTypeErrors.UnableToUpdateTodo);
      throw new Error(TodoTypeErrors.UnableToUpdateTodo);
    } finally {
      setProcessingTodoID(prev =>
        prev.filter(id => !toUpdate.some(t => t.id === id)),
      );
      setIsLoading(false);
    }
  };

  // update title in current todo
  const updateTitle = async (todoId: number, newTitle: string) => {
    setProcessingTodoID(prev => [...prev, todoId]);
    setIsLoading(true);
    try {
      const todo = todos.find(t => t.id === todoId);

      if (!todo) {
        throw new Error('Todo not found');
      }

      const updatedTodo = await updateTodo(todoId, {
        ...todo,
        title: newTitle,
      });

      setTodos(prev => prev.map(t => (t.id === todoId ? updatedTodo : t)));
    } catch {
      setError(TodoTypeErrors.UnableToUpdateTodo);
      throw new Error(TodoTypeErrors.UnableToUpdateTodo);
    } finally {
      setProcessingTodoID(prev => prev.filter(id => id !== todoId));
      setIsLoading(false);
    }
  };

  const hideError = () => {
    setError(null);
  };

  return {
    todos,
    isLoading,
    error,
    setError,
    add,
    remove,
    toggle,
    hideError,
    tempTodo,
    processingTodoID,
    setProcessingTodoID,
    removeCompleted,
    toggleAll,
    updateTitle,
  };
};
