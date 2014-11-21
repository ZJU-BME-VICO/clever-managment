

import java.util.Optional;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import edu.zju.bme.clever.management.service.entity.Role;
import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.repository.UserRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:web-context.xml")
public class UserRepoTest {

	@Autowired
	private UserRepository userRepo;

	@Test
	public void test() {
		Optional<User> user = Optional.ofNullable(this.userRepo.findOne(1));
		user.ifPresent(usr -> {
			System.out.println(usr.getUpdateTime());
		});
	}

	//@Test
	public void testEquals() {
		User user1 = new User();
		user1.setId(1);
		User user2 = new User();
		user2.setId(1);
		Role role = new Role();
		role.setId(1);
		System.out.println(user1.equals(role));
	}

	//@Test
	public void buildDatabase() {
		System.out.println("Succeeded.");
	}
}
