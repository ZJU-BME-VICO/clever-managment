package edu.zju.bme.clever.management.service;

import java.util.Calendar;
import java.util.List;

import edu.zju.bme.clever.management.service.entity.User;
import edu.zju.bme.clever.management.service.exception.UserNotFoundException;

public interface UserService {

	public User getUserByName(String userName);

	public void updateUser(User user);

	public List<User> getAllEnabledUsers();

	public void updateUserLogoutTime(String userName, Calendar logoutTime)
			throws UserNotFoundException;

	public void updateUserLogoutTime(User user, Calendar logoutTime);

	public void updateUserPassowrd(String userName, String password)
			throws UserNotFoundException;

	public void updateUserPassowrd(User user, String password);

}