package br.com.wisewallet.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;

@Service
public class Consumer {

    @KafkaListener(topics = "email_topic", groupId = "group_id")
    public void listen(String message) {
        System.out.println(MessageFormat.format("Received message: {0}", message));
    }
}
