package br.com.ufabc.streamchat.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Entity
public class Conexao {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String idSessao;
    private String usuario;
    private String sala;
}
