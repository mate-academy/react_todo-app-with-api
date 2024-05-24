import { deleteTodo } from '../api/todos';
import { TodoActions } from '../types/TodoActions';

export const handleDeletePost = async (
  todoId: number,
  actions: TodoActions,
) => {
  actions.disableTodo(true, todoId);

  try {
    await deleteTodo(todoId);
    actions.deleteTodoLocally(todoId);
  } catch (error) {
    actions.updateErrorStatus('DeleteTodoError');
  } finally {
    actions.disableTodo(false, todoId);
  }
};

export const handleDeleteMultiplePosts = async (
  todoIds: number[],
  actions: TodoActions,
) => {
  const deletePromises = todoIds.map(todoId =>
    handleDeletePost(todoId, actions),
  );

  await Promise.allSettled(deletePromises);
};
