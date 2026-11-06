package com.employee360.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private int score; // 1 to 5

    @Column(nullable = false, length = 50)
    private String label; // Rarely, Inconsistently, Effective, Strong, Role Model

    @Column(length = 255)
    private String description;

    public Rating() {}

    public Rating(int score, String label, String description) {
        this.score = score;
        this.label = label;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
