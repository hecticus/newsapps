package models;

import com.avaje.ebean.Page;
import play.data.validation.Constraints.MaxLength;
import play.data.validation.Constraints.Required;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@SuppressWarnings("serial")
@Entity
@Table(name="configs")
public class Config extends Model {
	
	/**
	 * Logger error types
	 */
	@Transient
	public static final int LOGGER_ERROR = 1;
	/**
	 * Logger error types
	 */
	@Transient
	public static final int LOGGER_INFO = 2;
	/**
	 * Logger error types
	 */
	@Transient
	public static final int LOGGER_WARN = 3;
	/**
	 * Logger error types
	 */
	@Transient
	public static final int LOGGER_DEBUG = 4;
	/**
	 * Logger error types
	 */
	@Transient
	public static final int LOGGER_TRACE = 5;
	
	@Transient
	public static final String ERROR_KEY = "error";
	@Transient
	public static final String DESCRIPTION_KEY = "description";
	@Transient
	public static final String RESPONSE_KEY = "response";
	@Transient
	public static final String SIZE_KEY = "size";
	@Transient
	public static final String MOD_KEY = "modify";
    @Transient
    public static final String EXCEPTION_KEY = "exception";
	
	@Transient
	public static final int DEFAULT_PAGE_SIZE = 500;

    @Transient
    public static final int PARAMETERS_ERROR = 666;

	@Id
	private Long idConfig;
	@Required
	@MaxLength(50)
	private String keyName;
	@Required
	private String value;
	@Required
	private String description;
	
	public static Model.Finder<Long, Config> finder = new
			Model.Finder<Long, Config>(Long.class, Config.class);
	
	public Long getIdConfig() {
		return idConfig;
	}
	public void setIdConfig(Long idConfig) {
		this.idConfig = idConfig;
	}
	public String getKeyName() {
		return keyName;
	}
	public void setKeyName(String keyName) {
		this.keyName = keyName;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
	public static Config getConfigByKey(String key){
		return finder.where().eq("keyName", key).findUnique();
	}
	
	public static String getString(String key){
		Config c = finder.where().eq("keyName", key).findUnique();
		return c.getValue();
	}
	
	public static Long getLong(String key){
		Config c = finder.where().eq("keyName", key).findUnique();
		return Long.parseLong(c.getValue());
	}
	
	public static String[] getStringArray(String key, String separator){
		Config c = finder.where().eq("keyName", key).findUnique();
		return c.getValue().split(separator);
	}
	
	public static int getInt(String key){
		Config c = finder.where().eq("keyName", key).findUnique();
		return Integer.parseInt(c.getValue());
	}

    public static Page<Config> page(int page, int pageSize, String sortBy, String order, String filter) {
        return finder.where().ilike("keyName", "%" + filter + "%").orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
    }
}
