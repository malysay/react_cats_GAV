import React, { useState, useEffect } from 'react';
import { db, ref, push, onValue } from './firebase'; // Подключение Firebase

export function TextSender() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Ссылка на "chat" в базе данных
    const messagesRef = ref(db, 'chat');
    
    // Слушатель изменений
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messageList = data ? Object.values(data) : [];
      setMessages(messageList);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      const messagesRef = ref(db, 'chat');
      push(messagesRef, {
        text: message,
        username: username, // Добавляем имя отправителя
        timestamp: Date.now()
      });
      setMessage(''); // Очистка поля ввода
    } else {
      alert('Введите имя и сообщение!');
    }
  };

  return (
    <div>
      <h1>Firebase Chat with Usernames</h1>
      
      {/* Поле для ввода имени пользователя */}
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      
      {/* Поле для сообщений */}
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      
      {/* Отображение сообщений */}
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username || 'Anonymous'}:</strong> {msg.text}{' '}
            <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
          </div>
        ))}
      </div>
    </div>
  );
}
