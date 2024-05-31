package br.com.wisewallet.service.transactions.impl;

import br.com.wisewallet.controller.expenses.form.CreateGoalForm;
import br.com.wisewallet.controller.expenses.response.GoalResponse;
import br.com.wisewallet.converter.GoalConverter;
import br.com.wisewallet.entity.Goal;
import br.com.wisewallet.entity.User;
import br.com.wisewallet.exceptions.AlterGoalDatabaseException;
import br.com.wisewallet.exceptions.CreateGoalDatabaseException;
import br.com.wisewallet.exceptions.GoalNotFoundByIdException;
import br.com.wisewallet.exceptions.UserNotFoundByIdException;
import br.com.wisewallet.repository.GoalRepository;
import br.com.wisewallet.repository.UserRepository;
import br.com.wisewallet.service.transactions.GoalService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final GoalConverter goalConverter;
    private final UserRepository userRepository;

    public GoalServiceImpl(GoalRepository goalRepository, GoalConverter goalConverter, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.goalConverter = goalConverter;
        this.userRepository = userRepository;
    }

    @Override
    public List<GoalResponse> findAll(Long userId) {

        Optional<List<Goal>> goalList = goalRepository.findByUserId(userId);
        if (goalList.isPresent()) {

            return goalList.get().stream()
                    .map(goal -> new GoalResponse(
                            goal.getId(),
                            goal.getDescription(),
                            goal.getValue(),
                            goal.getUserEstimate(),
                            goal.getId(),
                            goal.getEnabled()))
                    .toList();

        } else {
            throw new GoalNotFoundByIdException();
        }
    }

    @Override
    public GoalResponse createGoal(CreateGoalForm createGoalForm) {
        log.info("Creating goal");
        Goal goal = goalConverter.convert(createGoalForm);

        Optional<User> optionalUser = userRepository.findById(createGoalForm.userId());
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundByIdException();
        }

        try {
            goal.setUser(optionalUser.get());
            goal.setEnabled(Boolean.TRUE);
            goal.setCreatedAt(LocalDateTime.now());
            goalRepository.save(goal);

            return GoalResponse.builder()
                    .id(goal.getId())
                    .description(goal.getDescription())
                    .value(goal.getValue())
                    .userEstimate(goal.getUserEstimate())
                    .userId(optionalUser.get().getId())
                    .enabled(goal.getEnabled())
                    .build();

        } catch (Exception error) {
            log.error("Error: {}", error.getMessage());
            throw new CreateGoalDatabaseException();
        }
    }

    @Override
    public GoalResponse alterGoal(CreateGoalForm createGoalForm) {
        log.info("Altering Goal with ID: {}", createGoalForm.id());

        userRepository.findById(createGoalForm.userId()).orElseThrow(UserNotFoundByIdException::new);
        Goal existingGoal = goalRepository.findById(createGoalForm.id()).orElseThrow(GoalNotFoundByIdException::new);

        try {
            existingGoal.setDescription(createGoalForm.description());
            existingGoal.setValue(createGoalForm.value());
            existingGoal.setUserEstimate(createGoalForm.userEstimate());
            existingGoal.setEnabled(createGoalForm.enabled());

            Goal alteredGoal = goalRepository.save(existingGoal);

            return GoalResponse.builder()
                    .id(alteredGoal.getId())
                    .description(alteredGoal.getDescription())
                    .value(alteredGoal.getValue())
                    .userEstimate(alteredGoal.getUserEstimate())
                    .userId(existingGoal.getUser().getId())
                    .enabled(alteredGoal.getEnabled())
                    .build();

        } catch (Exception error) {
            log.error("Error altering goal with ID {} | {}", createGoalForm.id(), error.getMessage());
            throw new AlterGoalDatabaseException();
        }
    }
}
