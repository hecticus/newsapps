package models;

import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;

import javax.persistence.MappedSuperclass;

/**
 * Created by chrirod on 3/27/14.
 */
@MappedSuperclass
public abstract class HecticusModel extends Model {

    public abstract ObjectNode toJson();
}
