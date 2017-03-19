package app.module;

import lebah.portal.action.LebahModule;
import educate.db.DbPersistence;

/**
 * @author Shamsul Bahrin bin Abd Mutalib
 *
 */
public class LandingPageModule extends LebahModule {
	
	private DbPersistence db = new DbPersistence();
	private String path = "landingPage";
	
	public void preProcess() {
		String portal_login = (String) request.getSession().getAttribute("_portal_login");
		context.put("portal_login", portal_login);
	}

	/* (non-Javadoc)
	 * @see lebah.portal.action.LebahModule#start()
	 */
	@Override
	public String start() {
		return path + "/start.vm";
	}

}