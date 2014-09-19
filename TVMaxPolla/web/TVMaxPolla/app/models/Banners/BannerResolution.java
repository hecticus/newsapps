package models.Banners;

import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import java.util.List;


/**
 * Created by sorcerer on 4/22/14.
 */
@Entity
@Table(name="banner_resolution")
public class BannerResolution {

	  @Id
	  private Long idBannerResolution;
	  private int width;
	  private int height;
	  
	  
	  @Transient
	  private BannerFile file;
	  
	  
	  public static Model.Finder<Long,BannerResolution> finder =
	            new Model.Finder<Long, BannerResolution>(Long.class, BannerResolution.class);

	  public BannerResolution() {
		  //contructor por defecto
	  }
	  
	  public BannerResolution(int width, int height) {
	        this.width = width;
	        this.height = height;
	  }

	  public Long getIdBannerResolution() {
		  return idBannerResolution;
	  }

	  public void setIdBannerResolution(Long idBannerResolution) {
		  this.idBannerResolution = idBannerResolution;
	  }
	   
	  public int getWidth() {
		  return width;
	  }

	  public void setWidth(int width) {
		  this.width = width;
	  }

	  public int getHeight() {
		  return height;
	  }

	  public void setHeight(int height) {
		  this.height = height;
	  }

	  
	  public BannerFile getFile() {
		  return file;
	  }

	  public void setFile(BannerFile file) {
		  this.file = file;
	  }
	  
	  public List<BannerResolution> getAllBannerResolutions() {
	        return finder.all();
	  }
	  
	  
	  public static BannerResolution getBannerResolutionById(long id){
	        return finder.where().eq("id_banner_resolution", id).findUnique();
	    }
}


