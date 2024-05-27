package br.com.wisewallet.kafka;

import br.com.wisewallet.entity.CSVRecordEntity;
import br.com.wisewallet.repository.CSVRecordRepository;
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
    private final CSVRecordRepository csvRecordRepository;

    @Autowired
    public KafkaFileProducer(CSVRecordRepository csvRecordRepository) {
        this.csvRecordRepository = csvRecordRepository;
    }

    public void sendMessage(Path filePath) {
        try (Reader reader = Files.newBufferedReader(filePath);
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord csvRecord : csvParser) {

                String data = csvRecord.get("Data");
                double valor = Double.parseDouble(csvRecord.get("Valor"));
                String identificador = csvRecord.get("Identificador");
                String descricao = csvRecord.get("Descrição");

                CSVRecordEntity csvRecordEntity = CSVRecordEntity.builder()
                        .data(data)
                        .identificador(identificador)
                        .descricao(descricao)
                        .valor(valor)
                        .build();

                csvRecordRepository.save(csvRecordEntity);
                System.out.println("salvo");
                log.info("Saved CSV record to MongoDB: {}", csvRecordEntity);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
