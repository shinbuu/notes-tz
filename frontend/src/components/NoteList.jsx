// frontend/src/components/NoteList.jsx
import { useState } from 'react';
import NoteCard from '../components/NoteCard';

const NoteList = ({ notes, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Обработчик подтверждения удаления
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    
    const success = await onDelete(confirmDelete);
    if (success) {
      setConfirmDelete(null);
    }
  };
  
  if (notes.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>У вас пока нет заметок. Создайте первую!</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ваши заметки</h2>
      
      {/* Модальное окно подтверждения удаления */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Подтверждение удаления</h3>
            <p className="mb-4">Вы уверены, что хотите удалить эту заметку? Это действие невозможно отменить.</p>
            <div className="flex justify-end space-x-3">
              <button 
                className="btn bg-gray-200 hover:bg-gray-300"
                onClick={() => setConfirmDelete(null)}
              >
                Отмена
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={() => onEdit(note)}
            onDelete={() => setConfirmDelete(note.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteList;