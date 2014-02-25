package models;

import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;

import javax.persistence.MappedSuperclass;

/**
 * Created by sorcerer on 2/20/14.
 */
@MappedSuperclass
public abstract class HecticusModel extends Model {

    public abstract ObjectNode toJson();
}
