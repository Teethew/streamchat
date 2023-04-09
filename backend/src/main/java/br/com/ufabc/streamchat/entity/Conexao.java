package br.com.ufabc.streamchat.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Conexao {

    private String idSessao;
    private String usuario;
    private String sala;
}
