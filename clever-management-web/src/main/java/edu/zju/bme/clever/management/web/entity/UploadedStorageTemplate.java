package edu.zju.bme.clever.management.web.entity;


import org.springframework.web.multipart.MultipartFile;

public class UploadedStorageTemplate {
	private String name;
	private MultipartFile oet;
	private MultipartFile arm;

	public UploadedStorageTemplate() {

	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public MultipartFile getArm() {
		return arm;
	}

	public void setArm(MultipartFile arm) {
		this.arm = arm;
	}

	public MultipartFile getOet() {
		return oet;
	}

	public void setOet(MultipartFile oet) {
		this.oet = oet;
	}

}
