package mongo;

/**
 * Created by ntenisOT on 16/10/14.
 */

import com.mongodb.MongoClient;
import models.*;
import org.mongodb.morphia.Morphia;
import play.Logger;
import play.Play;

import java.net.UnknownHostException;

public final class MongoDB {

    /**
     * Connects to MongoDB based on the configuration settings.
     * <p/>
     * If the database is not reachable, an error message is written and the
     * application exits.
     */
    public static boolean connect() {
        String _mongoHost = Play.application().configuration().getString("mongodb.host");

        int _mongoPort = Play.application().configuration().getInt("mongodb.port");

        String _mongoDB = Play.application().configuration().getString("mongodb.database");

//        MongoClientURI mongoURI = new MongoClientURI(_mongoURI);

        MorphiaObject.mongo = null;

        try {
            MorphiaObject.mongo = new MongoClient(_mongoHost, _mongoPort);
        }
        catch(UnknownHostException e) {
            Logger.info("Unknown Host");
        }

        if (MorphiaObject.mongo != null) {
            MorphiaObject.morphia = new Morphia();
            MorphiaObject.datastore = MorphiaObject.morphia.createDatastore(MorphiaObject.mongo, _mongoDB);//mongoURI.getDatabase());

            //Map classes

            MorphiaObject.morphia.map(Location.class);

            MorphiaObject.datastore.ensureIndexes();
            MorphiaObject.datastore.ensureCaps();
        }

        Logger.debug("** Morphia datastore: " + MorphiaObject.datastore.getDB());

        return true;
    }


    /**
     * Disconnect from MongoDB.
     */
    public static boolean disconnect() {
        if (MorphiaObject.mongo == null) {
            return false;
        }

        MorphiaObject.morphia = null;
        MorphiaObject.datastore = null;
        MorphiaObject.mongo.close();
        return true;
    }
}

