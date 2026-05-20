import React from 'react';
import { addTodo, deleteTodo, updateTodo, USER_ID } from '../api/todos';
import { ErrorType } from '../types/Errors';
import { Todo } from '../types/Todo';

type Params = {
  todoList: Todo[];
  setTodoList: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setError: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  addLoadingTodo: (todoId: number) => void;
  removeLoadingTodo: (todoId: number) => void;
};

export const useTodoActions = ({
  todoList,
  setTodoList,
  inputRef,
  setError,
  addLoadingTodo,
  removeLoadingTodo,
}: Params) => {
  const [newTodoTitle, setNewTodoTitle] = React.useState('');
  const [isAddingTodo, setIsAddingTodo] = React.useState(false);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);

  const isAllCompleted =
    todoList.length > 0 && todoList.every(todo => todo.completed);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = newTodoTitle.trim();

    if (!normalizedTitle) {
      setError('titleInput');

      return;
    }

    try {
      setError(null);
      setIsAddingTodo(true);

      const temporaryTodo: Todo = {
        id: 0,
        title: normalizedTitle,
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(temporaryTodo);

      const createdTodo = await addTodo({
        title: normalizedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodoList(currentTodos => [...currentTodos, createdTodo]);

      setNewTodoTitle('');
    } catch {
      setError('unableToCreate');
    } finally {
      setIsAddingTodo(false);
      setTempTodo(null);

      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setError(null);

      addLoadingTodo(todoId);

      await deleteTodo(todoId);

      setTodoList(currentTodos =>
        currentTodos.filter(todo => todo.id !== todoId),
      );

      return true;
    } catch {
      setError('unableToDelete');

      return false;
    } finally {
      removeLoadingTodo(todoId);
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const todosToDelete = todoList.filter(todo => todo.completed);

    await Promise.all(todosToDelete.map(todo => handleDeleteTodo(todo.id)));
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      setError(null);

      addLoadingTodo(todo.id);

      const updatedTodo = await updateTodo({
        id: todo.id,
        completed: !todo.completed,
      });

      setTodoList(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === todo.id ? updatedTodo : currentTodo,
        ),
      );
    } catch {
      setError('unableToUpdate');
    } finally {
      removeLoadingTodo(todo.id);
    }
  };

  const handleToggleAll = async () => {
    const newCompletedStatus = !isAllCompleted;

    const todosToUpdate = todoList.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    try {
      setError(null);

      todosToUpdate.forEach(todo => addLoadingTodo(todo.id));

      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo({
            id: todo.id,
            completed: newCompletedStatus,
          }),
        ),
      );

      setTodoList(currentTodos =>
        currentTodos.map(todo => {
          const updatedTodo = updatedTodos.find(
            updated => updated.id === todo.id,
          );

          return updatedTodo || todo;
        }),
      );
    } catch {
      setError('unableToUpdate');
    } finally {
      todosToUpdate.forEach(todo => removeLoadingTodo(todo.id));
    }
  };

  const handleRenameTodo = async (todoId: number, newTitle: string) => {
    const normalizedTitle = newTitle.trim();

    if (!normalizedTitle) {
      setError('titleInput');

      return false;
    }

    try {
      setError(null);

      addLoadingTodo(todoId);

      const updatedTodo = await updateTodo({
        id: todoId,
        title: newTitle,
      });

      setTodoList(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );

      return true;
    } catch {
      setError('unableToUpdate');

      return false;
    } finally {
      removeLoadingTodo(todoId);
    }
  };

  return {
    tempTodo,
    isAddingTodo,
    newTodoTitle,
    setNewTodoTitle,
    isAllCompleted,
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleTodo,
    handleToggleAll,
    handleRenameTodo,
  };
};
