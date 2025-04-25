// frontend/src/pages/Notes.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const { logout } = useAuth();
  
  // Загрузка заметок если есть
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/notes');
        setNotes(response.data);
      } catch (err) {
        setError('Не удалось загрузить заметки');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Новая заметка
  const createNote = async (noteData) => {
    try {
      const response = await axios.post('/notes', noteData);
      setNotes([response.data, ...notes]);
      return true;
    } catch (err) {
      setError('Не удалось создать заметку');
      console.error(err);
      return false;
    }
  };

  // Обновление заметки
  const updateNote = async (id, noteData) => {
    try {
      const response = await axios.put(`/notes/${id}`, noteData);
      setNotes(notes.map(note => note.id === id ? response.data : note));
      setEditingNote(null);
      return true;
    } catch (err) {
      setError('Не удалось обновить заметку');
      console.error(err);
      return false;
    }
  };

  // Удаление заметки
  const deleteNote = async (id) => {
    try {
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
      return true;
    } catch (err) {
      setError('Не удалось удалить заметку');
      console.error(err);
      return false;
    }
  };

  // Выход с аккаунта
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Мои заметки</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Выйти
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
            <button 
              className="ml-2 text-sm text-red-500"
              onClick={() => setError('')}
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Форма для заметки */}
        <NoteForm 
          onSubmit={editingNote ? 
            (data) => updateNote(editingNote.id, data) : 
            createNote
          }
          initialData={editingNote}
          onCancel={editingNote ? () => setEditingNote(null) : undefined}
        />
        
        {/* Список заметок */}
        {loading ? (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <NoteList 
            notes={notes}
            onEdit={setEditingNote}
            onDelete={deleteNote}
          />
        )}
      </main>
    </div>
  );
};

export default Notes;