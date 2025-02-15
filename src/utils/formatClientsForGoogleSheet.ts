// src/utils/formatClientsForGoogleSheet.ts

import { Client } from "../contexts/ClientsContext";

// Заголовки
export const headers = [
  "ID",
  "Область",
  "Район",
  "Вид населенного пункта",
  "Наименование населенного пункта",
  "Тип улицы",
  "Улица",
  "№ Дома",
  "№ Квартиры",
  "Телефон",
  "ФИО",
  "Копия техпаспорта на жилое помещение",
  "№ Договора",
  "Дата заключения договора",
  "Торговая марка",
  "Серия оборудования",
  "Модель",
  "Дата ввода в эксплуатацию",
  "Серийный номер котла",
  "Вид Работ",
  "Дата ТО",
  "Дата планируемого ТО",
  "Причина отказа",
  "№ Гарантийного талона",
  "Исполнитель",
  "Акт осмотра вент каналов,срок действия",
  "Примечание",
  "Дата ремонта",
  "Замененная запчасть",
];

export function formatClientsForGoogleSheet(clients: Client[]) {
  return clients.map((client, index) => [
    index + 1,
    client["Область"] || "",
    client["Район"] || "",
    client["Вид населенного пункта"] || "",
    client["Наименование населенного пункта"] || "",
    client["Тип улицы"] || "",
    client["Улица"] || "",
    client["№ Дома"] || "",
    client["№ Квартиры"] || "",
    client["Телефон"] || "",
    client["ФИО"] || "",
    client["Копия техпаспорта на жилое помещение"] || "",
    client["№ Договора"] || "",
    client["Дата заключения договора"] || "",
    client["Торговая марка"] || "",
    client["Серия оборудования"] || "",
    client["Модель"] || "",
    client["Дата ввода в эксплуатацию"] || "",
    client["Серийный номер котла"] || "",
    client["Вид Работ"] || "",
    client["Дата ТО"] || "",
    client["Дата планируемого ТО"] || "",
    client["Причина отказа"] || "",
    client["№ Гарантийного талона"] || "",
    client["Исполнитель"] || "",
    client["Акт осмотра вент каналов,срок действия"] || "",
    client["Примечание"] || "",
    client["Дата ремонта"] || "",
    client["Замененная запчасть"] || "",
  ]);
}
