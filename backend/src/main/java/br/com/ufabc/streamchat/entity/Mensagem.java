package br.com.ufabc.streamchat.entity;

import lombok.Data;

@Data
public class Mensagem {

    private String usuario;
    private String mensagem;
    private String idSala;
}
