package com.example.demo.dto;


import java.time.LocalDateTime;

public class BonusResponseDTO {
    private String phone;
    private Integer bonus_points;
    private LocalDateTime createdAt;

    // Конструкторы
    public BonusResponseDTO() {}

    public BonusResponseDTO(String phone, Integer bonusPoints, LocalDateTime createdAt) {
        this.phone = phone;
        this.bonus_points = bonusPoints;
        this.createdAt = createdAt;
    }

    // Геттеры и сеттеры
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getBonusPoints() { return bonus_points; }
    public void setBonusPoints(Integer bonusPoints) { this.bonus_points = bonusPoints; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}