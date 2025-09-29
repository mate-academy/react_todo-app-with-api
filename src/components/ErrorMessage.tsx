import classNames from "classnames";

interface ErrorMessageProps {
    message: string
    handleErrorMessage: () => void
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, handleErrorMessage }) => {

    return (
        <div
            data-cy="ErrorNotification"
            className={classNames(
                'notification is-danger is-light has-text-weight-normal',
                { hidden: !message },
            )}
        >
            <button
                data-cy="HideErrorButton"
                type="button"
                className="delete"
                onClick={handleErrorMessage}
            />
            {message}
        </div>
    );
};