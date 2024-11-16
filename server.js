const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 }); // Сервер слушает порт 8080

// Храним список подключенных клиентов
const clients = [];

server.on("connection", (ws) => {
  // Добавляем нового клиента
  clients.push(ws);

  // Обрабатываем сообщение от клиента
  ws.on("message", (message) => {
    try {
      console.log("Получено сообщение:", message);
      const parsedMessage = JSON.parse(message); // Убедимся, что это JSON

      // Подготовка ответа (если необходимо)
      const response = JSON.stringify(parsedMessage); // Преобразуем обратно в JSON

      // Рассылаем сообщение всем подключенным клиентам
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(response); // Отправляем сообщение как JSON-строку
        }
      });
    } catch (error) {
      console.error("Ошибка обработки сообщения:", error, message); // Логируем ошибку
    }
  });

  ws.on("close", () => {
    const index = clients.indexOf(ws);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

console.log("WebSocket сервер запущен на ws://localhost:8080");
