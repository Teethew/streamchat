package br.com.ufabc.streamchat.entrypoint;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class RoomEventListener {

    @EventListener
    private void handleSessionConnected(SessionConnectEvent event) {
        System.out.println("Connected: " + event.getMessage());
    }

    @EventListener
    private void handleSessionDisconnect(SessionDisconnectEvent event) {
        System.out.println("Disconnected: " + event.getMessage());
    }
}
