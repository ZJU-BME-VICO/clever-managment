package edu.zju.bme.clever.management.test;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import edu.zju.bme.clever.management.repo.UserRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:service-beans.xml")
public class UserRepoTest {

	@Resource(name = "userRepo")
	private UserRepository userRepo;

	@Test
	public void test() {
		System.out.println("Succeeded.");
	}
}
