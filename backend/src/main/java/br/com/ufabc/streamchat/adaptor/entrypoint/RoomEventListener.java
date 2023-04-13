package br.com.ufabc.streamchat.adaptor.entrypoint;

import br.com.ufabc.streamchat.adaptor.ConexaoRepository;
import br.com.ufabc.streamchat.entity.Conexao;
import br.com.ufabc.streamchat.entity.Mensagem;
import br.com.ufabc.streamchat.usecase.EventUseCase;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Controller
@AllArgsConstructor
@Slf4j
public class RoomEventListener {

    private static final String SESSION_ID = "simpSessionId";

    private final EventUseCase eventUseCase;

    @Autowired
    private ConexaoRepository repository;

    @MessageMapping("/connect")
    public void conectarSala(@Payload Mensagem mensagem, @Header(SESSION_ID) String idSessao) {
        log.info("Connected: " + idSessao);
        Conexao conexao = new Conexao(
                idSessao,
                mensagem.getUsuario(),
                mensagem.getIdSala()
        );
        repository.save(conexao);
        log.info(repository.findAll().toString());
        eventUseCase.notificarConexao(idSessao);
    }

    @EventListener
    private void handleSessionDisconnect(SessionDisconnectEvent event) {
        String idSessao = (String) event.getMessage().getHeaders().get(SESSION_ID);
        Conexao conexao = repository.findByIdSessao(idSessao);
        repository.delete(conexao);
        log.info("Disconnected: " + idSessao);
        log.info(repository.findAll().toString());
        eventUseCase.notificarDesconexao(idSessao);
    }
}
