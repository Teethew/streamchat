package br.com.ufabc.streamchat.adaptor.entrypoint;

import br.com.ufabc.streamchat.entity.Mensagem;
import br.com.ufabc.streamchat.usecase.EventUseCase;
import lombok.AllArgsConstructor;
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
public class RoomEventListener {

    private static final String SESSION_ID = "simpSessionId";

    private final EventUseCase eventUseCase;

    @MessageMapping("/connect")
    public void conectarSala(@Payload Mensagem mensagem, @Header(SESSION_ID) String idSessao) {
        System.out.println("Connected: " + idSessao);
        eventUseCase.notificarConexao(idSessao);
    }

    @EventListener
    private void handleSessionDisconnect(SessionDisconnectEvent event) {
        String idSessao = (String) event.getMessage().getHeaders().get(SESSION_ID);
        System.out.println("Disconnected: " + idSessao);
        eventUseCase.notificarDesconexao(idSessao);
    }
}
