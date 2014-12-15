package edu.zju.bme.clever.management.service;

import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.UserNotFoundException;
import edu.zju.bme.clever.management.service.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepo;

	@Override
	public User getUserByName(String userName) {
		return this.userRepo.findByName(userName);
	}

	@Override
	public void updateUser(User user) {
		this.userRepo.save(user);
	}

	@Override
	public List<User> getAllEnabledUsers() {
		return this.userRepo.findByIsEnabledTrue();
	}

	@Override
	public void updateUserLogoutTime(String userName, Calendar logoutTime)
			throws UserNotFoundException {
		User user = this.userRepo.findByName(userName);
		if (user == null) {
			throw new UserNotFoundException("Cannot find user " + userName);
		}
		this.updateUserLogoutTime(user, logoutTime);
	}

	@Override
	public void updateUserLogoutTime(User user, Calendar logoutTime) {
		user.setLastLogoutTime(logoutTime);
		this.userRepo.save(user);
	}

	@Override
	public void updateUserPassowrd(String userName, String password)
			throws UserNotFoundException {
		User user = this.userRepo.findByName(userName);
		if (user == null) {
			throw new UserNotFoundException("Cannot find user " + userName);
		}
		this.updateUserPassowrd(user, password);
	}

	@Override
	public void updateUserPassowrd(User user, String password) {
		user.setPassword(password);
		this.userRepo.save(user);
	}

}
