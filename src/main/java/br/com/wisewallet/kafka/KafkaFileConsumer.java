package br.com.wisewallet.kafka;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;

@Service
@Slf4j
public class KafkaFileConsumer {

    @KafkaListener(topics = "statements", groupId = "wise-wallet")
    public void listen(String message) {
        log.info(MessageFormat.format("Received message: {0}", message));
    }
}
