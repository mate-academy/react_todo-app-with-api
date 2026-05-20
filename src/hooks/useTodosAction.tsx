import { useEffect } from 'react';
import { TodoViewModel } from '../types/Todo';
import {
  deleteTodo,
  getTodos,
  patchTodo,
  postTodo,
  USER_ID,
} from '../api/todos';
import { ERROR_MESSAGES } from '../constants/errors';

type TodoAction = {
  showError: (message: string) => void;
  todos: TodoViewModel[];
  setTodos: React.Dispatch<React.SetStateAction<TodoViewModel[]>>;
  tempTodo: TodoViewModel | null;
  setTempTodo: React.Dispatch<React.SetStateAction<TodoViewModel | null>>;
  completedTodos: TodoViewModel[];
  activeTodos: TodoViewModel[];
  updateTodoById: (id: number, patch: Partial<TodoViewModel>) => void;
};

export function useTodosAction({
  showError,
  todos,
  setTodos,
  tempTodo,
  setTempTodo,
  completedTodos,
  activeTodos,
  updateTodoById,
}: TodoAction) {
  useEffect(() => {
    getTodos()
      .then(res => {
        setTodos(res);
      })
      .catch(() => {
        showError(ERROR_MESSAGES.LOAD_TODOS);
      });
  }, [setTodos, showError]);

  async function createTodo(title: string) {
    const todoToSend = {
      title,
      userId: USER_ID,
      completed: false,
    };
    const newTodo: TodoViewModel = {
      id: 0,
      ...todoToSend,
      isLoading: true,
    };

    setTempTodo(newTodo);
    try {
      const res = await postTodo(todoToSend);

      setTodos(prev => [...prev, res]);
    } catch (e) {
      showError(ERROR_MESSAGES.ADD_TODOS);
      setTodos(prev => {
        return prev.filter(item => item.id !== 0);
      });
      throw e;
    } finally {
      setTempTodo(null);
    }
  }

  async function updateTodo(id: number, completed: boolean, title: string) {
    const newTodo = {
      completed,
      title,
    };

    try {
      await patchTodo(id, newTodo);
      updateTodoById(id, newTodo);
    } catch (e) {
      showError(ERROR_MESSAGES.UPDATE_TODO);
      throw e;
    }
  }

  async function deleteTodoById(id: number) {
    try {
      await deleteTodo(id);
      setTodos(prev => {
        return prev.filter(todo => todo.id !== id);
      });
    } catch {
      showError(ERROR_MESSAGES.DELETE_TODO);
      throw new Error(ERROR_MESSAGES.DELETE_TODO);
    }
  }

  async function deleteCompleted() {
    setTodos(prev =>
      prev.map(todo => (todo.completed ? { ...todo, isLoading: true } : todo)),
    );

    await Promise.all(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);

          setTodos(prev => prev.filter(item => item.id !== todo.id));
        } catch {
          showError(ERROR_MESSAGES.DELETE_TODO);
          updateTodoById(todo.id, { isLoading: false });
        }
      }),
    );
  }

  async function updateManyTodos(
    todosToUpdate: TodoViewModel[],
    nextValue: boolean,
  ) {
    setTodos(prev =>
      prev.map(todo =>
        todosToUpdate.includes(todo) ? { ...todo, isLoading: true } : todo,
      ),
    );
    await Promise.all(
      todosToUpdate.map(async todo => {
        try {
          await patchTodo(todo.id, { completed: nextValue });
          updateTodoById(todo.id, { completed: nextValue, title: todo.title });
        } catch {
          showError(ERROR_MESSAGES.UPDATE_TODO);
        } finally {
          updateTodoById(todo.id, { isLoading: false });
        }
      }),
    );
  }

  return {
    todos,
    tempTodo,
    deleteTodoById,
    deleteCompleted,
    createTodo,
    completedTodos,
    activeTodos,
    updateManyTodos,
    updateTodo,
  };
}
