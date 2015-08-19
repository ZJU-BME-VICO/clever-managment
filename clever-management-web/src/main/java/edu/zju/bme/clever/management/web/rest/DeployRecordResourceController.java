package edu.zju.bme.clever.management.web.rest;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.zju.bme.clever.management.service.DeployRecordService;
import edu.zju.bme.clever.management.web.entity.DeployRecordInfo;

@RestController
@RequestMapping("/deployRecords")
public class DeployRecordResourceController extends AbstractResourceController {

	@Autowired
	private DeployRecordService service;

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public List<DeployRecordInfo> getAllDeployRecords() {
		return this.service.getAllDeployRecords().stream().map(record -> {
			DeployRecordInfo info = new DeployRecordInfo();
			info.setId(record.getId());
			info.setComment(record.getComment());
			info.setDeployerId(record.getDeployer().getId());
			info.setDeployerName(record.getDeployer().getName());
			info.setDeployTime(record.getDeployTime());
			info.setSucceeded(record.isSucceeded());
			info.setMessage(record.getMessage());
			return info;
		}).collect(Collectors.toList());
	}
}
