package exceptions;

/**
 * Created by sorcerer on 5/20/14.
 */
public class TvmaxFeedException extends Exception {

    public TvmaxFeedException(String message) {
        super(message);
    }

    public TvmaxFeedException(String message, Throwable cause) {
        super(message, cause);
    }
}
