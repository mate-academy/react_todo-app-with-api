import { ErrorMessages } from '../enum/ErrorMessages';
import { updateTodo } from '../api/todos';
import { UpdateTodo } from '../types/UpdateTodo';

export const updateTodoValues = async (props: UpdateTodo) => {
  const { keyValue, setErrorMessage, setTodoLoading, setTodos, id, newData } =
    props;

  try {
    setErrorMessage(ErrorMessages.none);
    setTodoLoading(id, true);
    await updateTodo(id, { [keyValue]: newData });
    setTodos(prevTodos =>
      prevTodos.map(item =>
        item.id === id ? { ...item, [keyValue]: newData } : item,
      ),
    );
  } catch (error) {
    setErrorMessage(ErrorMessages.edit);
    throw error;
  } finally {
    setTodoLoading(id, false);
  }
};
