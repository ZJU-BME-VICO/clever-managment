package edu.zju.bme.clever.management.web.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openehr.am.archetype.Archetype;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.zju.bme.clever.management.service.ArchetypeValidateService;
import edu.zju.bme.clever.management.service.entity.FileProcessResult;
import se.acode.openehr.parser.ADLParser;

@RestController
@RequestMapping("/archetypes")
public class ArchetypeResourceController {

	protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ArchetypeValidateService archetypeValidateService;

	@RequestMapping(value = "/validation", method = RequestMethod.POST)
	public List<FileProcessResult> validateFiles(
			@RequestParam(value = "files", required = true) MultipartFile[] files) {
		final Map<String, Archetype> archetypes = new HashMap<String, Archetype>();
		final Map<String, FileProcessResult> results = new HashMap<String, FileProcessResult>();
		final List<FileProcessResult> allResults = new ArrayList<FileProcessResult>();
		Arrays.asList(files).forEach(
				file -> {
					String fileName = file.getOriginalFilename();
					long fileSize = file.getSize();
					this.logger.trace("Validating file: {}, size: {}.",
							fileName, fileSize);
					FileProcessResult result = new FileProcessResult();
					result.setName(fileName);
					result.setStatus(FileProcessResult.FileStatus.VALID);
					allResults.add(result);
					try {
						ADLParser parser = new ADLParser(file.getInputStream(),
								"UTF-8");
						Archetype archetype = parser.parse();
						archetypes.put(archetype.getArchetypeId().getValue(),
								archetype);
						results.put(archetype.getArchetypeId().getValue(),
								result);
					} catch (Throwable ex) {
						this.logger.debug("Parse file {} failed.",
								file.getOriginalFilename(), ex);
						result.setStatus(FileProcessResult.FileStatus.INVALID);
						result.setMessage("Archetype parse failed, error: "
								+ ex.getMessage());
					}
				});
		// Validate archetypes
		this.archetypeValidateService.validateConsistency(archetypes, results);
		return allResults;
	}

}
