package com.threeCodeMonkeyz.ReplayUIModule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReplayUiModuleApplication {

	public static void main(String[] args) {
		int[][] a = {{1,2},{3,4,5,6}};
		System.out.println(a.length);
		SpringApplication.run(ReplayUiModuleApplication.class, args);
	}

}
