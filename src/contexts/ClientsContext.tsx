import React, { createContext, useState, useContext, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { syncClientsWithGoogleSheet } from "../utils/googleSheets";

// Тип данных клиента
export interface Client {
  id: string;
  [key: string]: any;
}

// Тип для контекста
interface ClientsContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  updateClient: (updatedClient: Client) => void;
  deleteClient: (clientId: string) => void;
  addClient: (updatedClient: Client) => void;
}

// Создаем контекст
const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// Провайдер контекста
export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clients, setClients] = useState<Client[]>([]);

  // Подписка на изменения в Firestore (реальное время)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
      const clientsData: Client[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientsData);

      // При каждом изменении - синхронизируем с Google Sheets
      syncClientsWithGoogleSheet(clientsData);
    });

    // Отписка при размонтировании
    return () => unsubscribe();
  }, []);

  // Добавление клиента (локально + синхра)
  const addClient = (newClient: Client) => {
    setClients((prevClients) => {
      // Если клиент с таким id уже существует, просто возвращаем без изменений
      if (prevClients.find((c) => c.id === newClient.id)) {
        console.warn(`Клиент ${newClient.id} уже существует!`);
        return prevClients;
      }
      const updatedClients = prevClients.concat(newClient);
      syncClientsWithGoogleSheet(updatedClients);
      return updatedClients;
    });
  };

  // Обновление
  const updateClient = (updatedClient: Client) => {
    setClients((prevClients) => {
      const updatedClients = prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      );
      syncClientsWithGoogleSheet(updatedClients);
      return updatedClients;
    });
  };

  // Удаление
  const deleteClient = (clientId: string) => {
    setClients((prevClients) => {
      const updatedClients = prevClients.filter(
        (client) => client.id !== clientId
      );
      syncClientsWithGoogleSheet(updatedClients);
      return updatedClients;
    });
  };

  return (
    <ClientsContext.Provider
      value={{ clients, setClients, updateClient, deleteClient, addClient }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

// Хук для удобного доступа к контексту
export const useClients = (): ClientsContextType => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
};
