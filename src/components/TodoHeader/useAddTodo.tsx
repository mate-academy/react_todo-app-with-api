import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoService } from '../../api/todos';
import { useToDoContext } from '../../context/ToDo.context';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/Error';

export const useAddTodo = () => {
  const [title, setTitle] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    todos,
    addTodo,
    userId,
    setTemporaryTodo,
    showError,
  } = useToDoContext();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [title, isDisabled, todos]);

  const onAddTodo = (form: FormEvent) => {
    form.preventDefault();
    if (!title.trim()) {
      showError(ErrorMessage.title);

      return;
    }

    setIsDisabled(true);
    const tempTodo = {
      userId,
      completed: false,
      title: title.trim(),
    } as Todo;

    setTemporaryTodo(tempTodo);

    TodoService.addTodo(tempTodo)
      .then((newTodo) => {
        addTodo(newTodo);
        setTitle('');
      })
      .catch(() => showError(ErrorMessage.add))
      .finally(() => {
        setTemporaryTodo(null);
        setIsDisabled(false);
      });
  };

  return {
    addTodo,
    title,
    isDisabled,
    onChangeTitle: (value: string) => setTitle(value),
    onAddTodo,
    inputRef,
  };
};
