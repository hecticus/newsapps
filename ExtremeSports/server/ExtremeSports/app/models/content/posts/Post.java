package models.content.posts;

import com.avaje.ebean.Expr;
import com.avaje.ebean.Expression;
import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Predicate;
import models.HecticusModel;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.clients.Client;
import models.content.athletes.Athlete;
import models.content.athletes.SocialNetwork;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;
import utils.Utils;

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

    @OneToMany(mappedBy="post", cascade = CascadeType.ALL)
    private List<PostHasAthlete> athletes;

    @OneToMany(mappedBy="post", cascade = CascadeType.ALL)
    private List<PostHasCategory> categories;

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

    private static Model.Finder<Integer, Post> finder = new Model.Finder<Integer, Post>(Integer.class, Post.class);

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

    public Post(String date, String source, SocialNetwork socialNetwork) {
        this.date = date;
        this.source = source;
        this.socialNetwork = socialNetwork;
    }

    public Post(String date, String source, Integer push, Long pushDate, SocialNetwork socialNetwork) {
        this.date = date;
        this.source = source;
        this.push = push;
        this.pushDate = pushDate;
        this.socialNetwork = socialNetwork;
    }

    public void setIdPost(Integer idPost) {
        this.idPost = idPost;
    }

    public Integer getIdPost() {
        return idPost;
    }

    public List<PostHasAthlete> getAthletes() {
        return athletes;
    }

    public List<Athlete> getRealAthletes() {
        ArrayList<Athlete> toReturn = new ArrayList<>();
        for(PostHasAthlete postHasAthlete : athletes){
            toReturn.add(postHasAthlete.getAthlete());
        }
        return toReturn;
    }

    public List<Category> getPushableCategories() {
        Predicate<PostHasCategory> validObjs = new Predicate<PostHasCategory>() {
            public boolean apply(PostHasCategory obj) {
                return obj.getCategory().getFollowable();
            }
        };
        List<PostHasCategory> postHasCategories = (List<PostHasCategory>) Utils.filterCollection(categories, validObjs);
        if(postHasCategories != null && !postHasCategories.isEmpty()) {
            ArrayList<Category> toReturn = new ArrayList<>();
            for (PostHasCategory postHasCategory : postHasCategories) {
                toReturn.add(postHasCategory.getCategory());
            }
            return  toReturn;
        }
        return null;
    }

    public void setAthletes(List<PostHasAthlete> athletes) {
        this.athletes = athletes;
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

    public List<PostHasCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<PostHasCategory> categories) {
        this.categories = categories;
    }

    public String getPushDateAsString() {
        Date expiry = new Date(pushDate);
        SimpleDateFormat sf = new SimpleDateFormat("MM/dd/yyyy HH:mm");
        return sf.format(expiry);
    }

    public String getDateFormatted() {
        return date.substring(6, 8) + "/" + date.substring(4, 6) + "/" + date.substring(0, 4)+ " - " + date.substring(8, 10) + ":" + date.substring(10);
    }


    public String getTitle(){
        return localizations.get(0).getTitle();
    }

    public int getLocalizationIndex(Language language) {
        PostHasLocalization phl = PostHasLocalization.finder.where().eq("post", this).eq("language", language).findUnique();
        if(phl == null){
            return -1;
        }
        return localizations.indexOf(phl);
    }

    public int getAthleteIndex(Athlete athlete) {
        PostHasAthlete pha = PostHasAthlete.finder.where().eq("post", this).eq("athlete", athlete).findUnique();
        if(pha == null){
            return -1;
        }
        return athletes.indexOf(pha);
    }

    public int getCategoryIndex(Category category) {
        PostHasCategory phc = PostHasCategory.finder.where().eq("post", this).eq("category", category).findUnique();
        if(phc == null){
            return -1;
        }
        return categories.indexOf(phc);
    }

    public int getCountryIndex(Country country) {
        PostHasCountry phc = PostHasCountry.finder.where().eq("post", this).eq("country", country).findUnique();
        if(phc == null){
            return -1;
        }
        return countries.indexOf(phc);
    }

    public int getMediaIndex(String md5) {
        PostHasMedia phm = PostHasMedia.finder.where().eq("post", this).eq("md5", md5).findUnique();
        if(phm == null){
            return -1;
        }
        return countries.indexOf(phm);
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_post", idPost);
        //response.put("athletes", athletes.toJsonWithNetworks());
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

        if(categories != null && !categories.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(PostHasCategory ad : categories){
                apps.add(ad.getCategory().toJsonWithoutRelations());
            }
            response.put("categories", Json.toJson(apps));
        }

        if(athletes != null && !athletes.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(PostHasAthlete athlete : athletes){
                apps.add(athlete.getAthlete().toJson());
            }
            response.put("athletes", Json.toJson(apps));
        }

        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_post", idPost);
        //response.put("athletes", athletes.toJsonWithoutRelations());
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
//        response.put("athletes", athletes.toJsonWithoutRelations());
        //response.put("athletes", athletes.toJsonWithNetworks());
        response.put("date", date);
        response.put("source", source);
        response.put("social_network", socialNetwork.toJson());
        response.put("media", media == null?0:media.size());
        if(media != null && !media.isEmpty()){
            ArrayList<String> apps = new ArrayList<>();
            ArrayList<ObjectNode> resolutions = new ArrayList<>();
            for(PostHasMedia ad : media){
                ObjectNode resolution = Json.newObject();
                if(ad.getFileType().getName().equalsIgnoreCase("video")){
                    ad.updateWistiaPlayer();
                    apps.add(ad.getWistiaPlayer());
                    resolution.put("width", 0);
                    resolution.put("height", 0);
                } else {
                    apps.add(ad.getLink());
                    resolution.put("width", ad.getWidth());
                    resolution.put("height", ad.getHeight());
                }
                resolutions.add(resolution);
            }
            response.put("files", Json.toJson(apps));
            response.put("resolutions", Json.toJson(resolutions));
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
        if(athletes != null && !athletes.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(PostHasAthlete athlete : athletes){
                apps.add(athlete.getAthlete().toJsonSimple());
            }
            response.put("athletes", Json.toJson(apps));
        }

        if(categories != null && !categories.isEmpty()){
            ArrayList<ObjectNode> cats = new ArrayList<>();
            ArrayList<ObjectNode> tags = new ArrayList<>();
            for(PostHasCategory postHasCategory : categories){
                if(postHasCategory.getCategory().getFollowable()) {
                    cats.add(postHasCategory.getCategory().toJsonWithoutRelations());
                } else {
                    tags.add(postHasCategory.getCategory().toJsonWithoutRelations());
                }
            }
            response.put("categories", Json.toJson(cats));
            response.put("tags", Json.toJson(tags));
        }

        return response;
    }

    public ObjectNode toJsonOnlyMedia(Language language) {
        ObjectNode response = Json.newObject();
        response.put("id_post", idPost);
        response.put("source", source);
        response.put("media", media == null?0:media.size());
        if(media != null && !media.isEmpty()){
            ArrayList<String> apps = new ArrayList<>();
            ArrayList<ObjectNode> resolutions = new ArrayList<>();
            for(PostHasMedia ad : media){
                ObjectNode resolution = Json.newObject();
                if(ad.getFileType().getName().equalsIgnoreCase("video")){
                    ad.updateWistiaPlayer();
                    apps.add(ad.getWistiaPlayer());
                    resolution.put("width", 0);
                    resolution.put("height", 0);
                } else {
                    apps.add(ad.getLink());
                    resolution.put("width", ad.getWidth());
                    resolution.put("height", ad.getHeight());
                }
                resolutions.add(resolution);
            }
            response.put("files", Json.toJson(apps));
            response.put("resolutions", Json.toJson(resolutions));
        }
        if(localizations != null && !localizations.isEmpty()){
            for(PostHasLocalization ad : localizations){
                if(ad.getLanguage().getIdLanguage().intValue() == language.getIdLanguage().intValue()){
                    response.put("title", ad.getTitle());
                    //response.put("content", ad.getContent());
                    break;
                }
            }
        }
        return response;
    }

    public ObjectNode toJsonPreview(Language language) {
        ObjectNode response = Json.newObject();
        response.put("id_post", idPost);
        response.put("date", date);
        if(media != null && !media.isEmpty()){
            PostHasMedia postHasMedia = media.get(0);
            ObjectNode resolution = Json.newObject();
            if(postHasMedia.getFileType().getName().equalsIgnoreCase("video")){
                postHasMedia.updateWistiaPlayer();
                response.put("file", postHasMedia.getWistiaPlayer());
                resolution.put("width", 0);
                resolution.put("height", 0);
            } else {
                response.put("file", postHasMedia.getLink());
                resolution.put("width", postHasMedia.getWidth());
                resolution.put("height", postHasMedia.getHeight());
            }
            response.put("resolution", resolution);
        }
        if(localizations != null && !localizations.isEmpty()){
            for(PostHasLocalization ad : localizations){
                if(ad.getLanguage().getIdLanguage().intValue() == language.getIdLanguage().intValue()){
                    response.put("title", ad.getTitle());
                    break;
                }
            }
        }
        return response;
    }

    public static Page<Post> page(int page, int pageSize, String sortBy, String order, String filter) {
        return finder.where().ilike("localizations.title", "%" + filter + "%").orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
    }



    //Finder Operations

    public static Post getByID(int id){
        return finder.byId(id);
    }

    public static Iterator<Post> getPage(int pageSize, int page){
        Iterator<Post> iterator = null;
        if(pageSize == 0){
            iterator = finder.all().iterator();
        }else{
            iterator = finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
        }
        return  iterator;
    }

    public static Iterator<Post> getPosts(Athlete athlete, Category category, Country country, Language language, int postId, boolean onlyMedia, boolean newest){
        Iterator<Post> iterator = null;
        ArrayList<Athlete> athletesToCompare = null;
        if(athlete != null){
            athletesToCompare = new ArrayList<>();
            athletesToCompare.add(athlete);
        }
        int maxRows = Config.getInt("post-to-deliver");
        if(onlyMedia){
            maxRows = 1;
        }
        if(postId > 0) {
            if(athlete != null) {
                if (newest) {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("athletes").where().gt("idPost", postId).eq("athletes.athlete", athlete).eq("countries.country", country).eq("localizations.language", language).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                } else {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("athletes").where().lt("idPost", postId).eq("athletes.athlete", athlete).eq("countries.country", country).eq("localizations.language", language).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                }
            } else if (category != null){
                if (newest) {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("categories").where().gt("idPost", postId).eq("categories.category", category).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                } else {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("categories").where().lt("idPost", postId).eq("categories.category", category).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                }
            } else {
                if (newest) {
                    iterator = finder.fetch("countries").fetch("localizations").where().gt("idPost", postId).eq("countries.country", country).eq("localizations.language", language).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                } else {
                    iterator = finder.fetch("countries").fetch("localizations").where().lt("idPost", postId).eq("countries.country", country).eq("localizations.language", language).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                }
            }
        } else {
            if(athlete != null) {
                iterator = finder.fetch("countries").fetch("localizations").fetch("athletes").where().eq("athletes.athlete", athlete).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
            } else if (category != null){
                iterator = finder.fetch("countries").fetch("localizations").fetch("categories").where().eq("categories.category", category).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
            } else {
                iterator = finder.fetch("countries").fetch("localizations").where().eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
            }
        }

        return iterator;
    }

    public static Iterator<Post> getPosts(List<Athlete> athletes, List<Category> categories, Country country, Language language, int postId, boolean onlyMedia, boolean newest){
        Iterator<Post> iterator = null;
        int maxRows = Config.getInt("post-to-deliver");
        if(onlyMedia){
            maxRows = 1;
        }
        if(postId > 0) {
            if(athletes != null && categories != null) {
                Expression inCategories = Expr.in("categories.category", categories);
                Expression inAthletes = Expr.in("athletes.athlete", athletes);
                if (newest) {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("athletes").fetch("categories").where().gt("idPost", postId).or(inAthletes, inCategories).eq("countries.country", country).eq("localizations.language", language.getIdLanguage()).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                } else {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("athletes").fetch("categories").where().lt("idPost", postId).or(inAthletes, inCategories).eq("countries.country", country).eq("localizations.language", language.getIdLanguage()).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                }
            } else if(athletes != null) {
                if (newest) {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("athletes").where().gt("idPost", postId).in("athletes.athlete", athletes).eq("countries.country", country).eq("localizations.language", language.getIdLanguage()).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                } else {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("athletes").where().lt("idPost", postId).in("athletes.athlete", athletes).eq("countries.country", country).eq("localizations.language", language.getIdLanguage()).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                }
            } else if (categories != null){
                if (newest) {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("categories").where().gt("idPost", postId).in("categories.category", categories).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                } else {
                    iterator = finder.fetch("countries").fetch("localizations").fetch("categories").where().lt("idPost", postId).in("categories.category", categories).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                }
            }
        } else {
            if(athletes != null && categories != null) {
                Expression inCategories = Expr.in("categories.category", categories);
                Expression inAthletes = Expr.in("athletes.athlete", athletes);
                iterator = finder.fetch("countries").fetch("localizations").fetch("athletes").fetch("categories").where().or(inAthletes, inCategories).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
            } else if(athletes != null) {
                iterator = finder.fetch("countries").fetch("localizations").fetch("athletes").where().in("athletes.athlete", athletes).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
            } else if (categories != null){
                iterator = finder.fetch("countries").fetch("localizations").fetch("categories").where().in("categories.category", categories).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
            }
        }
        return iterator;
    }

    public List<Post> relatedByAthletes(List<Athlete> athlete, Country country, Language language) {
        int maxRelated = 3;
        return finder.fetch("countries").fetch("localizations").fetch("athletes").where().ne("idPost",this.idPost).in("athletes.athlete", athlete).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRelated).orderBy("date desc").findList();
    }

    public List<Post> relatedByCategory(List<Category> categories, Country country, Language language){
        int maxRelated = 3;
        return finder.fetch("countries").fetch("localizations").fetch("categories").where().ne("idPost",this.idPost).in("categories.category", categories).eq("countries.country", country).eq("localizations.language", language).setFirstRow(0).setMaxRows(maxRelated).orderBy("date desc").findList();
    }

    public static List<Post> getPostsToPush(){
        return finder.where().eq("push", 1).lt("pushDate", System.currentTimeMillis()).findList();
    }
}
