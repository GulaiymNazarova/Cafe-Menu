package com.example.demo.service;

import com.example.demo.model.Client;
import com.example.demo.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    /**
     * Проверяет или создает клиента по номеру телефона
     */
    @Transactional
    public Client checkOrCreateClient(String phone) {
        // Нормализуем номер телефона (убираем все нецифровые символы)
        String normalizedPhone = phone.replaceAll("\\D", "");

        if (normalizedPhone.length() != 10) {
            throw new IllegalArgumentException("Phone number must be 10 digits");
        }

        return clientRepository.findByPhone(normalizedPhone)
                .orElseGet(() -> {
                    Client newClient = new Client(normalizedPhone);
                    return clientRepository.save(newClient);
                });
    }

    /**
     * Добавляет бонусные баллы клиенту
     */
    @Transactional
    public Client addBonusPoints(String phone, Integer points) {
        String normalizedPhone = phone.replaceAll("\\D", "");

        Client client = clientRepository.findByPhone(normalizedPhone)
                .orElseThrow(() -> new IllegalArgumentException("Client not found with phone: " + normalizedPhone));

        client.addBonusPoints(points);
        return clientRepository.save(client);
    }

    /**
     * Получает информацию о клиенте по номеру телефона
     */
    public Client getClientByPhone(String phone) {
        String normalizedPhone = phone.replaceAll("\\D", "");
        return clientRepository.findByPhone(normalizedPhone)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));
    }
}
