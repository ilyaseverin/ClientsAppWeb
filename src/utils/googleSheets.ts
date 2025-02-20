import { Client } from "../contexts/ClientsContext";
import {
  formatClientsForGoogleSheet,
  headers,
} from "./formatClientsForGoogleSheet";

const URL =
  "https://script.google.com/macros/s/AKfycbxm-T6DXhskMjib5Wu36aUsJa4R7U5ZokPQLl7wAdAUAbgkwtJuutE6SSrZpE5pv0V1/exec";

export async function syncClientsWithGoogleSheet(clients: Client[]) {
  try {
    const formattedClients = formatClientsForGoogleSheet(clients);

    // Вместо application/json → ставим text/plain
    // Плюс добавляем redirect: "follow"
    const response = await fetch(URL, {
      method: "POST",
      redirect: "follow",
      headers: {
        // Ключевой момент: text/plain → браузер не делает preflight
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "sync",
        headers,
        values: formattedClients,
      }),
    });

    const result = await response.json();
    if (result.status === "success") {
      console.log("Данные успешно синхронизированы с Google Таблицей");
    } else {
      console.error("Ошибка при синхронизации:", result.message);
    }
  } catch (error) {
    console.error("Ошибка при отправке данных в Google Таблицу:", error);
  }
}
