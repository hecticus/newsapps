package models;

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
public class Config extends Model{

	@Id
	private Long idConfig;
	@Required
	@MaxLength(50)
	private String key;
	@Required
	private String value;
	@Required
	private String description;
	
	public static Finder<Long, Config> finder = new
			Finder<Long, Config>(Long.class, Config.class);
	
	public Long getIdConfig() {
		return idConfig;
	}
	public void setIdConfig(Long idConfig) {
		this.idConfig = idConfig;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
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
		return finder.where().eq("key", key).findUnique();
	}
	
	public static String getString(String key){
		Config c = finder.where().eq("key", key).findUnique();
		return c.getValue();
	}
	
	public static Long getLong(String key){
		Config c = finder.where().eq("key", key).findUnique();
		return Long.parseLong(c.getValue());
	}
	
	public static String[] getStringArray(String key, String separator){
		Config c = finder.where().eq("key", key).findUnique();
		return c.getValue().split(separator);
	}
	
	public static int getInt(String key){
		Config c = finder.where().eq("key", key).findUnique();
		return Integer.parseInt(c.getValue());
	}
	

	public static String getRackspaceUser() {
		Config c = finder.where().eq("key","rackspace-username").findUnique();
		return c.getValue();
	}

	public static String getRackspaceApiKey() {
		Config c = finder.where().eq("key","rackspace-apiKey").findUnique();
		return c.getValue();
	}

    public static String getRackspaceProvider() {
        Config c = finder.where().eq("key","rackspace-provider").findUnique();
        return c.getValue();
    }

}
