// frontend/src/components/NoteForm.jsx
import { useState, useEffect } from 'react';

const NoteForm = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Если передан initialData (режим редактирования), заполняем форму
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    } else {
      // Сброс формы, если выключен режим редактирования
      setTitle('');
      setContent('');
    }
  }, [initialData]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Проверка наличия заголовка
    if (!title.trim()) {
      alert('Заголовок заметки обязателен');
      setLoading(false);
      return;
    }
    
    const success = await onSubmit({ title, content });
    
    if (success) {
      // Если не в режиме редактирования, очищаем форму
      if (!initialData) {
        setTitle('');
        setContent('');
      }
    }
    
    setLoading(false);
  };
  
  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Редактировать заметку' : 'Создать новую заметку'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Заголовок</label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content" className="form-label">Содержание</label>
          <textarea
            id="content"
            className="form-input min-h-[100px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              className="btn bg-gray-200 hover:bg-gray-300"
              onClick={onCancel}
            >
              Отмена
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : initialData ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;