import { FormEvent, useState } from "react";
import { Todo } from "../types/Todo";


interface TodoUpdateTitleFormProps {
defaultValue: Todo['title'],
onSubmit: (title: Todo['title']) => void;
onCancel: () => void;

}

export const TodoUpdateTitleForm = ({
    defaultValue,
    onSubmit,
    onCancel
}: TodoUpdateTitleFormProps) => {
    const [newTitle, setNewTitle] = useState(defaultValue);

    const handleSaveNewTitle = () => {
        onSubmit(newTitle.trim())
    }

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();
handleSaveNewTitle()
   }

   const handleOnBlur = () => {
    handleSaveNewTitle()
   }
    return (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            autoFocus
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value.trimStart())}
            onBlur={handleOnBlur}
            onKeyUp={event  => {
                if (event.key === 'Escape') {
                   onCancel()
                }

            }
              }
          />
        </form>
    )
}