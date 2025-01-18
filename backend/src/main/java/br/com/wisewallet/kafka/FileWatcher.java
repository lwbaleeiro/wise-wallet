package br.com.wisewallet.kafka;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service("customFileWatcher")
public class FileWatcher {

    private final KafkaFileProducer kafkaFileProducer;
    private final Set<Path> processedFiles = new HashSet<>();
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private WatchService watchService;

    private final static String directoryToWatch = "E:/Code/kafka-files/";

    public FileWatcher(KafkaFileProducer kafkaFileProducer) {
        this.kafkaFileProducer = kafkaFileProducer;
    }

    @PostConstruct
    public void init() {
        executorService.submit(this::watchDirectory);
    }

    @PreDestroy
    public void shutdown() throws IOException, InterruptedException {
        watchService.close();
        executorService.shutdown();
        executorService.awaitTermination(10, TimeUnit.SECONDS);
    }

    private void watchDirectory() {
        try {
            watchService = FileSystems.getDefault().newWatchService();
            Path path = Paths.get(directoryToWatch);
            path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);

            while (!Thread.currentThread().isInterrupted()) {
                WatchKey key;

                try {
                    key = watchService.take();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }

                for (WatchEvent<?> event : key.pollEvents()) {
                    Path filePath = path.resolve((Path) event.context());
                    if (filePath.toString().endsWith(".csv") && !processedFiles.contains(filePath)) {
                        try {
                            Thread.sleep(1000);
                            kafkaFileProducer.sendMessage(filePath);
                            processedFiles.add(filePath);
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                            log.error("Erro ao aguardar antes de processar o arquivo: {}", filePath, e);
                        }
                    }
                }
                key.reset();
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                watchService.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}