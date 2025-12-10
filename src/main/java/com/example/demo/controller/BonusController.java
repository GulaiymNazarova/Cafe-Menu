package com.example.demo.controller;


import com.example.demo.dto.BonusRequestDTO;
import com.example.demo.dto.BonusResponseDTO;
import com.example.demo.model.Client;
import com.example.demo.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "*") // Разрешаем запросы с фронтенда
public class BonusController {

    @Autowired
    private ClientService clientService;

    /**
     * POST /api/client/check-bonus
     * Проверяет или создает клиента
     */
    @PostMapping("/check-bonus")
    public ResponseEntity<?> checkBonus(@RequestBody BonusRequestDTO request) {
        try {
            Client client = clientService.checkOrCreateClient(request.getPhone());

            BonusResponseDTO response = new BonusResponseDTO(
                    client.getPhone(),
                    client.getBonusPoints(),
                    client.getCreatedAt()
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Server error");
        }
    }

    /**
     * POST /api/client/update-bonus
     * Добавляет бонусные баллы
     */
    @PostMapping("/update-bonus")
    public ResponseEntity<?> updateBonus(@RequestBody BonusRequestDTO request) {
        try {
            Client client = clientService.addBonusPoints(request.getPhone(), request.getPoints());

            BonusResponseDTO response = new BonusResponseDTO(
                    client.getPhone(),
                    client.getBonusPoints(),
                    client.getCreatedAt()
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Server error");
        }
    }

    /**
     * GET /api/client/bonus/{phone}
     * Получает информацию о бонусах по номеру телефона
     */
    @GetMapping("/bonus/{phone}")
    public ResponseEntity<?> getBonus(@PathVariable String phone) {
        try {
            Client client = clientService.getClientByPhone(phone);

            BonusResponseDTO response = new BonusResponseDTO(
                    client.getPhone(),
                    client.getBonusPoints(),
                    client.getCreatedAt()
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Server error");
        }
    }
}