package app.module;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import app.entity.Person;
import lebah.template.LebahRecordTemplateModule;
import lebah.template.OperatorEqualOrGreaterThan;
import lebah.template.OperatorEqualOrLessThan;


/**
 * 
 * @author Shamsul Bahrin bin Abd Mutalib
 *
 */

public class MyContactsRecordModule extends LebahRecordTemplateModule<Person> {
	
	@Override
	public Class getIdType() {
		// TODO Auto-generated method stub
		return String.class;
	}

	@Override
	public void afterSave(Person p) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void beforeSave() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void begin() {
		setOrderBy("name");
		
	}

	@Override
	public boolean delete(Person p) throws Exception {
		return true;
	}

	@Override
	public String getPath() {
		return "views/myContactsRecord";
	}

	@Override
	public Class<Person> getPersistenceClass() {
		return Person.class;
	}

	@Override
	public void getRelatedData(Person p) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void save(Person p) throws Exception {
		p.setName(getParam("name"));
		p.setContactNumber(getParam("contactNumber"));
		p.setAddress(getParam("address"));
		if ( !"".equals(getParam("birthDate")) )
			p.setBirthDate(new SimpleDateFormat("dd-MM-yyyy").parse(getParam("birthDate")));
		
	}

	@Override
	public Map<String, Object> searchCriteria() throws Exception {
		Map<String, Object> m = new HashMap<String, Object>();
		m.put("name", getParam("find_name"));
		m.put("address", getParam("find_address"));
		
		if ( !"".equals(getParam("find_birthAfter"))) {
			m.put("findBirthAfter:birthDate", new OperatorEqualOrGreaterThan(new SimpleDateFormat("dd-MM-yyyy").parse(getParam("find_birthAfter"))));
		}
		if ( !"".equals(getParam("find_birthBefore"))) {
			m.put("findBirthBefore:birthDate", new OperatorEqualOrLessThan(new SimpleDateFormat("dd-MM-yyyy").parse(getParam("find_birthBefore"))));
		}
		return m;
	}

}
