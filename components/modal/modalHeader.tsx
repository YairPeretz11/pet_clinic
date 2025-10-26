interface ModalHeaderProps {
  title: string;
  onDelete?: () => void;
}

export default function ModalHeader({ title, onDelete }: ModalHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-xl font-semibold text-muted-800 dark:text-white tracking-tight">
        {title}
      </h2>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="btn btn-outline !px-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30"
          aria-label="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Zm10-3h-2.5l-.71-.71A1 1 0 0 0 12.09 3h-.18a1 1 0 0 0-.7.29L10.5 4H8a1 1 0 0 0-1 1v1h10V5a1 1 0 0 0-1-1Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
