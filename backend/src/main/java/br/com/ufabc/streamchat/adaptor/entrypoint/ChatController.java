package br.com.ufabc.streamchat.adaptor.entrypoint;

import br.com.ufabc.streamchat.adaptor.MensagemRepository;
import br.com.ufabc.streamchat.entity.Mensagem;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@CrossOrigin
@Controller
@AllArgsConstructor
public class ChatController {

    private static final String CHAT_ROOM = "/chat/room/";
    private static final String CHAT_MESSAGE = "/chat/message";
    private static final String EVENT_TOPIC = "/event/";

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MensagemRepository mensagemRepository;

    @MessageMapping("/chat/message")
    public void publicarMensagem(@Payload Mensagem mensagem, @Header("simpSessionId") String sessionId) {
        simpMessagingTemplate.convertAndSend("/chat/room/" + mensagem.getIdSala(), mensagem);
    }



//    @MessageMapping("/chat/connect")
//    public void entrarSala(@Payload Mensagem mensagem, @Headers Map<String, String> headers) {
//        Mensagem saved = mensagemRepository.save(mensagem);
//        System.out.println("Mensagem salva: " + saved);
//    }

    private void notificarEvento(@Payload Mensagem mensagem, @Headers Map<String, String> headers) {
        simpMessagingTemplate.convertAndSend(EVENT_TOPIC + mensagem.getIdSala(), mensagem);
    }
}
