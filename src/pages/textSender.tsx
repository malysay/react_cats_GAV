import { Space, Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';

export const TextSender = () => {

  const [message, setMessage] = useState<string>(''); // Сообщение, которое вводит пользователь
  const [messages, setMessages] = useState<string[]>([]); // Все полученные сообщения
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Устанавливаем WebSocket-соединение
    socketRef.current = new WebSocket('ws://localhost:8080'); // Адрес сервера WebSocket

    // Обрабатываем входящие сообщения
    socketRef.current.onmessage = (event) => {
      try {
        console.log("Входящее сообщение:", event.data); // Логируем входящее сообщение
        const receivedMessage = JSON.parse(event.data); // Парсим JSON
        if (receivedMessage.text) {
          setMessages((prevMessages) => [...prevMessages, receivedMessage.text]); // Добавляем сообщение
        }
      } catch (error) {
        console.error("Ошибка при обработке сообщения:", error, event.data); // Логируем данные и ошибку
      }
    };

    return () => {
      // Закрываем соединение при размонтировании компонента
      socketRef.current?.close();
    };
  }, []);

  // Отправляем сообщение
  const sendMessage = () => {
    if (socketRef.current && message.trim()) {
      const messageData = { text: message };
      const jsonString = JSON.stringify(messageData); // Преобразуем в строку JSON
      console.log("Отправляем сообщение:", jsonString); // Логируем перед отправкой
      socketRef.current.send(jsonString); // Отправляем через WebSocket
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage("");
    }
  };

  return (
    <div>
      <Typography.Title level={1}>Chat Application</Typography.Title>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение"
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
      <div>
        <h2>Сообщения:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
