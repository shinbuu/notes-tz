// frontend/src/components/NoteCard.jsx
import { FaEdit, FaTrash } from 'react-icons/fa';

const NoteCard = ({ note, onEdit, onDelete }) => {
  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <div className="flex space-x-2">
          <button 
            className="text-blue-500 hover:text-blue-700"
            onClick={onEdit}
            title="Редактировать"
          >
            <FaEdit />
          </button>
          <button 
            className="text-red-500 hover:text-red-700"
            onClick={onDelete}
            title="Удалить"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="flex-grow">
        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Создано: {formatDate(note.created_at)}</p>
        {note.updated_at !== note.created_at && (
          <p>Обновлено: {formatDate(note.updated_at)}</p>
        )}
      </div>
    </div>
  );
};

export default NoteCard;