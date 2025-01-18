package br.com.wisewallet.kafka;

import br.com.wisewallet.entity.Transactions;
import br.com.wisewallet.repository.TransactionsRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@Service
public class KafkaFileProducer {

    private final TransactionsRepository transactionsRepository;

    @Autowired
    public KafkaFileProducer(TransactionsRepository transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    public void sendMessage(Path filePath) {

        if (!isFileReady(filePath)) {
            log.warn("The file still in use: {}",  filePath);
            return;
        }

        try (Reader reader = Files.newBufferedReader(filePath);
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord csvRecord : csvParser) {

                Transactions transactions = Transactions.builder()
                        .date(csvRecord.get("Data"))
                        .identification(csvRecord.get("Identificador"))
                        .description(csvRecord.get("Descrição"))
                        .amount(Double.parseDouble(csvRecord.get("Valor")))
                        .build();

                transactionsRepository.save(transactions);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private boolean isFileReady(Path filePath) {
        try (var channel = Files.newByteChannel(filePath)) {
            return true;
        }  catch (IOException e) {
            return false;
        }
    }
}
