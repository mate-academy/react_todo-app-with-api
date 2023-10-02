import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoService } from '../../api/todos';
import { useToDoContext } from '../../context/ToDo.context';
import { ErrorMessage } from '../../types/Error';
import { useTodoList } from './useTodoList';

export const useTodoRow = (
  useTodo: Todo,
  isEdited: boolean,
  editTodo: (todoId:number | null) => void,
) => {
  const {
    onEditTodo,
    removeTodo,
    showError,
  } = useToDoContext();
  const { isLoading, setLoading } = useTodoList();
  const [editedTitle, setEditedTitle] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdited]);

  const deleteTodo = (todo: Todo) => new Promise(resolve => {
    setLoading(todo.id, true);

    TodoService.deleteTodo(todo.id)
      .then(() => removeTodo(todo.id)).then(resolve)
      .catch(() => showError(ErrorMessage.delete))
      .finally(() => setLoading(todo.id, false));
  });

  const saveTodo = (todo: Todo) => new Promise(resolve => {
    setLoading(todo.id, true);
    TodoService.editTodo(todo)
      .then(onEditTodo).then(resolve)
      .catch(() => showError(ErrorMessage.update))
      .finally(() => setLoading(todo.id, false));
  });

  const handleEdit = (event:FormEvent) => {
    event.preventDefault();

    if (editedTitle.trim() === useTodo.title) {
      editTodo(null);

      return;
    }

    if (!editedTitle.trim()) {
      deleteTodo(useTodo);

      return;
    }

    saveTodo({ ...useTodo, title: editedTitle.trim() })
      .then(() => {
        setEditedTitle('');
        editTodo(null);
      });
  };

  return {
    isLoading,
    saveTodo,
    deleteTodo,
    setLoading,
    editedTitle,
    setEditedTitle,
    handleEdit,
    inputRef,
  };
};
