// src/utils/googleSheets.ts
import { Client } from "../contexts/ClientsContext";
import {
  formatClientsForGoogleSheet,
  headers,
} from "./formatClientsForGoogleSheet";

const URL =
  "1https://script.google.com/macros/s/AKfycbxm-T6DXhskMjib5Wu36aUsJa4R7U5ZokPQLl7wAdAUAbgkwtJuutE6SSrZpE5pv0V1/exec";

export async function syncClientsWithGoogleSheet(clients: Client[]) {
  try {
    const formattedClients = formatClientsForGoogleSheet(clients);
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
