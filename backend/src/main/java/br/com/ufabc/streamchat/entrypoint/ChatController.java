package br.com.ufabc.streamchat.entrypoint;

import br.com.ufabc.streamchat.entity.Mensagem;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@Controller
@AllArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat/message")
    public void publicarMensagem(@Payload Mensagem mensagem, @Header("simpSessionId") String sessionId) {
        simpMessagingTemplate.convertAndSend("/chat/room/" + mensagem.getIdSala(), mensagem);
    }
}
