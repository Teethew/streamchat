package br.com.ufabc.streamchat.usecase;

public interface EventUseCase {

    void notificarConexao(String idSessao);

    void notificarDesconexao(String idSessao);
}
