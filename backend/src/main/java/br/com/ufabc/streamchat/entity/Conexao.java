package br.com.ufabc.streamchat.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Entity
@AllArgsConstructor
public class Conexao {

    private String idSessao;
    private String usuario;
    private String sala;
}
