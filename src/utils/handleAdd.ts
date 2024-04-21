import { addTodo } from '../api/todos';
import { Setters } from '../types/Setters';
import { errorText } from '../constants';
import { item } from './utils';

export function handleAdd(title: string, setters: Setters) {
  const newTodo = item.createNew(title, false);

  setters.setLoading(true);
  setters.setErrorMessage('');
  setters.setTempTodo(newTodo);

  return addTodo(newTodo)
    .then(todo => {
      setters.setTodos(prevTodos => {
        return [...prevTodos, { ...todo, loading: false }];
      });
    })
    .catch(error => {
      setters.setErrorMessage(errorText.failAdding);
      setters.setTempTodo(null);
      throw error;
    })
    .finally(() => {
      setters.setLoading(false);
      setters.setTempTodo(null);
    });
}
