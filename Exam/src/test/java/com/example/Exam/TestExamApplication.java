package com.example.Exam;

import org.springframework.boot.SpringApplication;

public class TestExamApplication {

	public static void main(String[] args) {
		SpringApplication.from(ExamApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
