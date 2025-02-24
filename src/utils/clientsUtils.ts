/**
 * Рассчитывает клиентов, у которых запланировано ТО в ближайшие 7 дней.
 * Если дата уже прошла в этом году, считается, что ТО запланировано на следующий год.
 *
 * @param clientsData Массив клиентов
 * @returns Объект, где ключ – дата в формате "YYYY-MM-DD", а значение – массив клиентов
 */
export const calculateUpcomingClients = (clientsData: any[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const grouped: Record<string, any[]> = {};

  clientsData.forEach((client) => {
    const dateStr = client["Дата планируемого ТО"] || client["Дата ТО"];
    if (dateStr) {
      const dateObj = new Date(dateStr);
      dateObj.setHours(0, 0, 0, 0);

      // Если дата уже прошла в этом году, берем следующий год
      const targetMonth = dateObj.getMonth();
      const targetDay = dateObj.getDate();
      let targetYear = today.getFullYear();

      const adjustedDate = new Date(targetYear, targetMonth, targetDay);
      if (adjustedDate < today) {
        targetYear += 1;
      }
      const finalDate = new Date(targetYear, targetMonth, targetDay);

      if (finalDate >= today && finalDate <= nextWeek) {
        // Форматируем дату в виде "YYYY-MM-DD" (en-CA)
        const formattedDate = finalDate.toLocaleDateString("en-CA");
        if (!grouped[formattedDate]) {
          grouped[formattedDate] = [];
        }
        grouped[formattedDate].push(client);
      }
    }
  });

  return grouped;
};

/**
 * Вычисляет количество клиентов по месяцам.
 * @param clientsData Массив клиентов
 * @returns Массив объектов для выпадающего списка, где label — название месяца с годом и количеством, value — значение в формате YYYY-MM
 */
export const calculateMonthlyCounts = (clientsData: any[]) => {
  const counts: Record<string, number> = {};

  clientsData.forEach((client) => {
    const date = client["Дата планируемого ТО"] || client["Дата ТО"];
    if (date) {
      const clientMonth = new Date(date).toISOString().slice(0, 7);
      counts[clientMonth] = (counts[clientMonth] || 0) + 1;
    }
  });

  // Преобразуем в массив для Select
  const items = Object.keys(counts)
    .sort()
    .map((month) => {
      const [year, monthNumber] = month.split("-");
      const monthName = new Date(
        parseInt(year, 10),
        parseInt(monthNumber, 10) - 1
      ).toLocaleString("ru-RU", {
        month: "long",
      });
      return {
        label: `${
          monthName.charAt(0).toUpperCase() + monthName.slice(1)
        } ${year} (${counts[month]})`,
        value: month,
      };
    });

  return items;
};

/**
 * Фильтрует клиентов по выбранному месяцу.
 * Группирует их по дате (формат YYYY-MM-DD) и сортирует по возрастанию дат.
 * @param clientsData Массив клиентов
 * @param month Значение месяца в формате YYYY-MM
 * @returns Объект, где ключ — дата, а значение — массив клиентов
 */
export const filterClientsByMonth = (clientsData: any[], month: string) => {
  const groupedClients: Record<string, any[]> = {};

  clientsData.forEach((client) => {
    const date = client["Дата планируемого ТО"] || client["Дата ТО"];
    if (date) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      const clientMonth = formattedDate.slice(0, 7);
      if (clientMonth === month) {
        if (!groupedClients[formattedDate]) {
          groupedClients[formattedDate] = [];
        }
        groupedClients[formattedDate].push(client);
      }
    }
  });

  // Сортируем даты по возрастанию
  const sorted = Object.keys(groupedClients)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .reduce<Record<string, any[]>>((acc, date) => {
      acc[date] = groupedClients[date];
      return acc;
    }, {});

  return sorted;
};
