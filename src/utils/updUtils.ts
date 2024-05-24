import { updateTodo } from '../api/todos';
import { State } from '../types/State';
import { Todo } from '../types/Todo';
import { TodoActions } from '../types/TodoActions';

export const handleTodoStatusUpdate = async (
  todoId: number,
  state: State,
  actions: TodoActions,
) => {
  const result = state.todos.find(task => task.id === todoId);

  if (result) {
    const updStatusTodo: Todo = {
      ...result,
      completed: !result.completed,
    };

    actions.disableTodo(true, todoId);
    try {
      const response = await updateTodo(updStatusTodo);

      actions.updateTodoLocally(response);
    } catch (error) {
      actions.updateErrorStatus('UpdateTodoError');
    } finally {
      actions.disableTodo(false, todoId);
    }
  }
};

export const handleAllTodosStatusUpdate = async (
  todoIds: number[],
  state: State,
  actions: TodoActions,
) => {
  const allCompleted = state.todos.every(todo => todo.completed);
  const promises = todoIds.map(todoId => {
    const todo = state.todos.find(task => task.id === todoId);

    if (todo && todo.completed === allCompleted) {
      return handleTodoStatusUpdate(todoId, state, actions);
    }

    return Promise.resolve();
  });

  await Promise.allSettled(promises);

  actions.setFilter(state.filter);
};

export const handlePostTitleUpdate = async (
  todo: Todo,
  actions: TodoActions,
) => {
  actions.disableTodo(true, todo.id);

  try {
    const response = await updateTodo(todo);

    actions.updateTodoLocally(response);

    return { success: true };
  } catch (error) {
    actions.updateErrorStatus('UpdateTodoError');

    return { success: false, error: 'Unable to update todo' };
  } finally {
    actions.disableTodo(false, todo.id);
  }
};
