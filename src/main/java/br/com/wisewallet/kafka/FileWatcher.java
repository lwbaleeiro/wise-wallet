package br.com.wisewallet.kafka;

import br.com.wisewallet.repository.CSVRecordRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service("customFileWatcher")
public class FileWatcher {

    private final static String directoryToWatch = "C:/Users/lw_ba/OneDrive/Documents/Java/wise-wallet/src/main/resources/statements/";

    private final KafkaFileProducer kafkaFileProducer;
    private final Set<Path> processedFiles = new HashSet<>();
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private WatchService watchService;

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
                        kafkaFileProducer.sendMessage(filePath);
                        processedFiles.add(filePath);
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