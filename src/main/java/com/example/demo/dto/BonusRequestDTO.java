package com.example.demo.dto;


public class BonusRequestDTO {
    private String phone;
    private Integer points;

    // Конструкторы
    public BonusRequestDTO() {}

    public BonusRequestDTO(String phone, Integer points) {
        this.phone = phone;
        this.points = points;
    }

    // Геттеры и сеттеры
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
}