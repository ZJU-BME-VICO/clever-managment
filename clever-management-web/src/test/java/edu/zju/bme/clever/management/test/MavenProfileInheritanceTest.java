package edu.zju.bme.clever.management.test;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:web-beans.xml")
public class MavenProfileInheritanceTest {

	@Resource(name = "mavenProfileInheritance")
	private MavenProfileInheritance mavenProfileInheritance;

	@Test
	public void test() {
		this.mavenProfileInheritance.printValue();
	}
}
