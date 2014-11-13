package edu.zju.bme.clever.management.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.MappedSuperclass;

/**
 * Abstract class for entity with column id.
 * 
 * @author Jacky Lau
 *
 */
@SuppressWarnings("serial")
@MappedSuperclass
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AbstractIndentifiedEntity implements Serializable {

	@Id
	@Column
	@GeneratedValue
	private Integer id;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Override
	public boolean equals(Object obj) {
		if (this.getClass().isInstance(obj)) {
			return this.getClass().cast(obj).getId() == this.id;
		}
		return false;
	}
}
