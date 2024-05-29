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

    private static final String TOPIC = "statements";
    private final TransactionsRepository transactionsRepository;

    @Autowired
    public KafkaFileProducer(TransactionsRepository transactionsRepository) {
        this.transactionsRepository = transactionsRepository;
    }

    public void sendMessage(Path filePath) {
        try (Reader reader = Files.newBufferedReader(filePath);
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord csvRecord : csvParser) {

                String data = csvRecord.get("Data");
                double valor = Double.parseDouble(csvRecord.get("Valor"));
                String identificador = csvRecord.get("Identificador");
                String descricao = csvRecord.get("Descrição");

                Transactions transactions = Transactions.builder()
                        .data(data)
                        .identificador(identificador)
                        .descricao(descricao)
                        .valor(valor)
                        .build();

                transactionsRepository.save(transactions);
                log.info("Saved CSV record to MongoDB: {}", transactions);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
