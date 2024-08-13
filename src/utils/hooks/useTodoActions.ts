import { addTodos, delateTodos, patchTodos } from '../../api/todos';
import { useTodoContext } from '../../context/TodoContext';
import { ErrorMessages } from '../../types/ErrorMessages/ErrorMessages';
import { Todo } from '../../types/Todo/Todo';
import { isAllTodosComplete } from '../helpers/filterService';

export const useTodoActions = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    showError,
    setLoadingTodoIds,
    setLockedFocus,
  } = useTodoContext();

  const editTodo = async (id: number, data: Partial<Todo>) => {
    try {
      setLoadingTodoIds([id]);
      const editedTodo = await patchTodos(id, data);

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          if (todo.id === id) {
            return editedTodo;
          }

          return todo;
        }),
      );
    } catch (error) {
      showError(ErrorMessages.Update);
      throw error;
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const createTodo = async ({ userId, completed, title }: Todo) => {
    try {
      const newTodo = await addTodos({ userId, completed, title });

      setTodos(curenTodos => [...curenTodos, newTodo]);
    } catch (error) {
      showError(ErrorMessages.Add);
      throw error;
    }
  };

  const deleteTodo = async (todosId: number[]) => {
    setLockedFocus(false);
    try {
      setErrorMessage('');
      setLoadingTodoIds(todosId);

      for (const id of todosId) {
        await delateTodos(id);
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      showError(ErrorMessages.Delete);
      throw error;
    } finally {
      setLockedFocus(true);
      setLoadingTodoIds(null);
    }
  };

  const delateOneTodo = async (todoId: number) => {
    try {
      setLoadingTodoIds([todoId]);
      await delateTodos(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      showError(ErrorMessages.Delete);
      throw error;
    } finally {
      setLoadingTodoIds(null);
    }
  };

  const clearCompletedTodos = async () => {
    let updatedTodos = [...todos];

    const results = await Promise.allSettled(
      todos
        .filter(todo => todo.completed)
        .map(async todo => {
          try {
            await deleteTodo([todo.id]);

            return { id: todo.id, success: true };
          } catch {
            showError(ErrorMessages.Delete);

            return { id: todo.id, success: false };
          }
        }),
    );

    updatedTodos = updatedTodos.filter(todo => {
      const result = results.find(
        r => r.status === 'fulfilled' && r.value && r.value.id === todo.id,
      );

      return (
        !result || (result.status === 'fulfilled' && !result.value.success)
      );
    });

    setTodos(updatedTodos);
  };

  const toggleAllCompleted = async () => {
    if (isAllTodosComplete(todos)) {
      try {
        setLoadingTodoIds(todos.map(todo => todo.id));

        const updatedTodos = await Promise.all(
          todos.map(todo => patchTodos(todo.id, { completed: false })),
        );

        setTodos(updatedTodos);
      } catch {
        setErrorMessage('Unable to update todos');
      } finally {
        setLoadingTodoIds([]);
      }

      return;
    }

    const filteredTodos = todos.filter(todo => !todo.completed);
    const activeIds = filteredTodos.map(todo => todo.id);

    setLoadingTodoIds(activeIds);

    try {
      await Promise.all(
        filteredTodos.map(todo => patchTodos(todo.id, { completed: true })),
      );

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          if (!todo.completed) {
            return { ...todo, completed: true };
          }

          return todo;
        }),
      );
    } catch {
      showError(ErrorMessages.Update);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  return {
    createTodo,
    deleteTodo,
    editTodo,
    clearCompletedTodos,
    toggleAllCompleted,
    delateOneTodo,
  };
};
