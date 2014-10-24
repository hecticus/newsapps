package models.content.posts;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.basic.Country;
import models.basic.Language;
import models.content.women.SocialNetwork;
import models.content.women.Woman;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="post")
public class Post extends HecticusModel {

    @Id
    private Integer idPost;

    @ManyToOne
    @JoinColumn(name = "id_woman")
    private Woman woman;

    @Constraints.Required
    private String date;

    @Constraints.Required
    private String source;

    @OneToOne
    @JoinColumn(name = "id_social_network")
    private SocialNetwork socialNetwork;

    @Constraints.Required
    private Integer push;

    @Constraints.Required
    private Long pushDate;

    @OneToMany(mappedBy="post", cascade = CascadeType.ALL)
    private List<PostHasMedia> media;

    @OneToMany(mappedBy="post", cascade = CascadeType.ALL)
    private List<PostHasCountry> countries;

    @OneToMany(mappedBy="post", cascade = CascadeType.ALL)
    private List<PostHasLocalization> localizations;

    public static Model.Finder<Integer, Post> finder = new Model.Finder<Integer, Post>(Integer.class, Post.class);

    public Post() {
        TimeZone tz = TimeZone.getDefault();
        Calendar actualDate = new GregorianCalendar(tz);
        SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmm");
        push = 1;
        pushDate = actualDate.getTimeInMillis();
        date = sf.format(actualDate.getTime());
        media = new ArrayList<>();
        countries = new ArrayList<>();
        localizations = new ArrayList<>();
    }

    public Post(Woman woman, String date, String source, SocialNetwork socialNetwork) {
        this.woman = woman;
        this.date = date;
        this.source = source;
        this.socialNetwork = socialNetwork;
    }

    public Post(Woman woman, String date, String source, Integer push, Long pushDate, SocialNetwork socialNetwork) {
        this.woman = woman;
        this.date = date;
        this.source = source;
        this.push = push;
        this.pushDate = pushDate;
        this.socialNetwork = socialNetwork;
    }

    public Integer getIdPost() {
        return idPost;
    }

    public Woman getWoman() {
        return woman;
    }

    public void setWoman(Woman woman) {
        this.woman = woman;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<PostHasMedia> getMedia() {
        return media;
    }

    public void setMedia(List<PostHasMedia> media) {
        this.media = media;
    }

    public List<PostHasCountry> getCountries() {
        return countries;
    }

    public void setCountries(List<PostHasCountry> countries) {
        this.countries = countries;
    }

    public List<PostHasLocalization> getLocalizations() {
        return localizations;
    }

    public void setLocalizations(List<PostHasLocalization> localizations) {
        this.localizations = localizations;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Integer getPush() {
        return push;
    }

    public void setPush(Integer push) {
        this.push = push;
    }

    public Long getPushDate() {
        return pushDate;
    }

    public void setPushDate(Long pushDate) {
        this.pushDate = pushDate;
    }

    public SocialNetwork getSocialNetwork() {
        return socialNetwork;
    }

    public void setSocialNetwork(SocialNetwork socialNetwork) {
        this.socialNetwork = socialNetwork;
    }

    public String getPushDateAsString() {
        Date expiry = new Date(pushDate);
        SimpleDateFormat sf = new SimpleDateFormat("MM/dd/yyyy HH:mm");
        return sf.format(expiry);
    }

    public String getDateFormatted() {
        return date.substring(6, 8) + "/" + date.substring(4, 6) + "/" + date.substring(0, 4)+ " - " + date.substring(8, 10) + ":" + date.substring(10);
    }



    public int getLocalizationIndex(Language language) {
        PostHasLocalization phl = PostHasLocalization.finder.where().eq("post.idPost", idPost).eq("language.idLanguage", language.getIdLanguage()).findUnique();
        if(phl == null){
            return -1;
        }
        return localizations.indexOf(phl);
    }

    public int getCountryIndex(Country country) {
        PostHasCountry phc = PostHasCountry.finder.where().eq("post.idPost", idPost).eq("country.idCountry", country.getIdCountry()).findUnique();
        if(phc == null){
            return -1;
        }
        return countries.indexOf(phc);
    }

    public int getMediaIndex(String md5) {
        PostHasMedia phm = PostHasMedia.finder.where().eq("post.idPost", idPost).eq("md5", md5).findUnique();
        if(phm == null){
            return -1;
        }
        return countries.indexOf(phm);
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_post", idPost);
        response.put("woman", woman.toJsonWithNetworks());
        response.put("date", date);
        response.put("source", source);
        response.put("push", push);
        response.put("push_date", pushDate);
        response.put("social_network", socialNetwork.toJson());
        response.put("media", media == null?0:media.size());
        if(media != null && !media.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(PostHasMedia ad : media){
                apps.add(ad.toJsonWithoutPost());
            }
            response.put("files", Json.toJson(apps));
        }
        if(countries != null && !countries.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(PostHasCountry ad : countries){
                apps.add(ad.toJsonWithoutPost());
            }
            response.put("countries", Json.toJson(apps));
        }
        if(localizations != null && !localizations.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(PostHasLocalization ad : localizations){
                apps.add(ad.toJsonWithoutPost());
            }
            response.put("localizations", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_post", idPost);
        response.put("woman", woman.toJsonWithoutRelations());
        response.put("date", date);
        response.put("source", source);
        response.put("push", push);
        response.put("push_date", pushDate);
        response.put("social_network", socialNetwork.toJson());
        response.put("media", media == null?0:media.size());
        return response;
    }

    public ObjectNode toJson(Language language) {
        ObjectNode response = Json.newObject();
        response.put("id_post", idPost);
//        response.put("woman", woman.toJsonWithoutRelations());
        response.put("woman", woman.toJsonWithNetworks());
        response.put("date", date);
        response.put("source", source);
        response.put("social_network", socialNetwork.toJson());
        response.put("media", media == null?0:media.size());
        if(media != null && !media.isEmpty()){
            ArrayList<String> apps = new ArrayList<>();
            for(PostHasMedia ad : media){
                apps.add(ad.getLink());
            }
            response.put("files", Json.toJson(apps));
        }
        if(localizations != null && !localizations.isEmpty()){
            for(PostHasLocalization ad : localizations){
                if(ad.getLanguage().getIdLanguage().intValue() == language.getIdLanguage().intValue()){
                    response.put("title", ad.getTitle());
                    response.put("content", ad.getContent());
                    break;
                }
            }
        }
        return response;
    }

    public static Page<Post> page(int page, int pageSize, String sortBy, String order, String filter) {
//        return finder.where().setFirstRow(page).setMaxRows(pageSize).findList();
        return finder.where()//.ilike("headLine", "%" + filter + "%").orderBy(sortBy + " " + order)
         .findPagingList(pageSize).getPage(page);
    }
}
