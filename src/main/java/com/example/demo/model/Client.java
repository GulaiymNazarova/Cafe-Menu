package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clients", uniqueConstraints = @UniqueConstraint(columnNames = "phone"))
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "bonus_points")
    private Integer bonusPoints = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Конструкторы
    public Client() {
        this.createdAt = LocalDateTime.now();
    }

    public Client(String phone) {
        this.phone = phone;
        this.bonusPoints = 0;
        this.createdAt = LocalDateTime.now();
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getBonusPoints() { return bonusPoints; }
    public void setBonusPoints(Integer bonusPoints) { this.bonusPoints = bonusPoints; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Метод для добавления бонусов
    public void addBonusPoints(Integer points) {
        if (this.bonusPoints == null) {
            this.bonusPoints = 0;
        }
        this.bonusPoints += points;
    }
}