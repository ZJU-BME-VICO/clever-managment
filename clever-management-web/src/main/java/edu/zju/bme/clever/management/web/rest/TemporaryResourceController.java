package edu.zju.bme.clever.management.web.rest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.ServletContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jmx.export.annotation.ManagedAttribute;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import edu.zju.bme.clever.management.web.entity.FileUploadResult;

@Controller
@ManagedResource
@RequestMapping("/temp")
public class TemporaryResourceController extends AbstractResourceController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Resource
	private ServletContext servletContext;

	private static final String TEMP_FOLDER_PATH = "/upload/temp/";
	private static final String[] IMG_EXTENSION = { "gif", "jpeg", "jpg",
			"bmp", "png" };

	@ManagedAttribute
	public String getTemporaryFolderSize() throws IOException {
		String tempFolderUrl = servletContext.getRealPath("/WEB-INF"
				+ TEMP_FOLDER_PATH);
		Path tempFolderPath = Paths.get(tempFolderUrl);
		long size = Files.walk(tempFolderPath).filter(p -> p.toFile().isFile())
				.mapToLong(p -> p.toFile().length()).sum();
		return new DecimalFormat(",###").format(size) + "b";
	}

	@ManagedOperation
	public void cleanTemporaryFolder() throws IOException {
		String tempFolderUrl = servletContext.getRealPath("/WEB-INF"
				+ TEMP_FOLDER_PATH);
		Path tempFolderPath = Paths.get(tempFolderUrl);
		Files.walk(tempFolderPath).filter(p -> p.toFile().isFile())
				.forEach(p -> {
					try {
						Files.delete(p);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				});
		// Delete empty folder
		Files.newDirectoryStream(tempFolderPath).forEach(p -> {
			try {
				Files.delete(p);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		});
	}

	@RequestMapping(value = "/img", method = RequestMethod.POST)
	@ResponseBody
	public FileUploadResult uploadTemporaryImage(
			@RequestParam(value = "img", required = true) MultipartFile img,
			Authentication authentication) {
		final String lowerCaseFileName = img.getOriginalFilename()
				.toLowerCase();
		final FileUploadResult result = new FileUploadResult();
		boolean isAllowedExtension = false;
		for (String allowedExtension : IMG_EXTENSION) {
			if (lowerCaseFileName.endsWith("." + allowedExtension)) {
				isAllowedExtension = true;
				break;
			}
		}
		if (!isAllowedExtension) {
			result.setSucceeded(false);
			result.setMessage("Not a image file.");
			return result;
		}
		String userName = ((UserDetails) authentication.getPrincipal())
				.getUsername();
		String tempFolderUrl = servletContext.getRealPath("/WEB-INF"
				+ TEMP_FOLDER_PATH);
		File tempFolder = new File(tempFolderUrl);
		if (!tempFolder.exists()) {
			tempFolder.mkdir();
		}
		String uuid = UUID.randomUUID().toString();
		File userFolder = new File(tempFolderUrl + "/" + userName);
		// create user folder if not exists
		if (!userFolder.exists()) {
			userFolder.mkdir();
		}
		File imgFile = new File(userFolder, uuid);
		while (imgFile.exists()) {
			uuid = UUID.randomUUID().toString();
			imgFile = new File(userFolder, uuid);
		}
		try {
			img.transferTo(imgFile);
		} catch (IllegalStateException | IOException ex) {
			this.logger.info("Save img failed.", ex);
			result.setSucceeded(false);
			result.setMessage("Save image failed.");
			return result;
		}
		result.setSucceeded(true);
		result.setMessage(TEMP_FOLDER_PATH + userName + "/" + uuid);
		return result;
	}
}
