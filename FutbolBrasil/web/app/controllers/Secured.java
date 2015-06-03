package controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.Config;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;
import utils.Utils;

/**
 * Created by plesse on 3/12/15.
 */
public class Secured extends Security.Authenticator {

    public final static String AUTH_TOKEN_HEADER = "HECTICUS-X-AUTH-TOKEN";

    /**
     * Metodo para definir la validacion del token donde se envie el md5 de autenticacion
     *
     * @param ctx       context de la aplicacion para minar el header
     * @return          null para rechazar y cualquier string para aceptar
     */
    @Override
    public String getUsername(Http.Context ctx) {
        boolean isSecured = Utils.getIsSecured();
        if(isSecured) {
            Http.Request request = ctx.request();
            String realOrigin = null;
            if (request.headers().containsKey("X-Forwarded-For")) {
                realOrigin = request.headers().get("X-Forwarded-For")[0];
            }
            String ipString = request.remoteAddress();
            boolean secured = true;

            if ((request.host() != null && !request.host().isEmpty() && (request.host().startsWith("127.0.0.1") || request.host().startsWith("10.0.3"))) || ipString.startsWith("127.0.0.1") || ipString.startsWith("10.0.3") || (realOrigin != null && !realOrigin.isEmpty() && (realOrigin.startsWith("127.0.0.1") || realOrigin.startsWith("10.0.3")))) {
                secured = false;
            }

            if (secured) {
                String[] authTokenHeaderValues = request.headers().get(AUTH_TOKEN_HEADER);
                if ((authTokenHeaderValues != null) && (authTokenHeaderValues.length == 1) && (authTokenHeaderValues[0] != null)) {
                    boolean valid = validateAuthToken(authTokenHeaderValues[0]);
                    if (valid) {
                        Utils.printToLog(Secured.class, null, "Valid Token " + authTokenHeaderValues[0], false, null, "support-level-1", Config.LOGGER_INFO);
                        return "OK";
                    }
                    Utils.printToLog(Secured.class, null, "Invalid Token " + authTokenHeaderValues[0], false, null, "support-level-1", Config.LOGGER_INFO);
                } else {
                    Utils.printToLog(Secured.class, null, "Missing Header " + AUTH_TOKEN_HEADER, false, null, "support-level-1", Config.LOGGER_INFO);
                }
                return null;
            } else {
                return "OK";
            }
        } else {
            return "OK";
        }
    }

    private boolean validateAuthToken(String authTokenHeaderValue) {
        try {
            String companyName = Config.getString("company-name");//1234
            String buildVersion = Config.getString("build-version");//9
            String serverVersion = Config.getString("server-version");//1
            String keyCompanyName = authTokenHeaderValue.substring(0, companyName.length());//1234
            char first = authTokenHeaderValue.charAt(companyName.length());//)
            String keyBuildVersion = authTokenHeaderValue.substring(companyName.length() + 1, companyName.length() + 1 + buildVersion.length());//
            char second = authTokenHeaderValue.charAt(companyName.length() + 1 + buildVersion.length());
            String keyServerVersion = authTokenHeaderValue.substring(companyName.length() + 1 + keyBuildVersion.length() + 1);
            boolean valid = companyName.contentEquals(keyCompanyName) && buildVersion.contentEquals(keyBuildVersion) && serverVersion.contentEquals(keyServerVersion);
            int indexFirst = buildVersion.charAt(0) - 48;
            int indexSecond = serverVersion.charAt(0) - 48;
            valid &= validChar(indexFirst, first);
            valid &= validChar(indexSecond, second);
            System.out.println(keyCompanyName + " " + first + " " + keyBuildVersion + " " + second + " " + keyServerVersion + " " + indexFirst + " " + indexSecond + " " + valid);
            return valid;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean validChar(int caseToValidate, char charToValidate){
        switch (caseToValidate){
            case 1:
                return charToValidate == '|';
            case 2:
                return charToValidate == '@';
            case 3:
                return charToValidate == '#';
            case 4:
                return charToValidate == '$';
            case 5:
                return charToValidate == '%';
            case 6:
                return charToValidate == '&';
            case 7:
                return charToValidate == '/';
            case 8:
                return charToValidate == '(';
            case 9:
                return charToValidate == ')';
            case 0:
                return charToValidate == '=';
            default:
                return false;
        }
    }

    /**
     * Metodo para manejar los request rechazados por no tener el token de autenticacion o poner tener el token incorrecto
     *
     * @param ctx       contexto http (obligatorio)
     * @return          respuesta a dar al usuario rechazado
     */
    @Override
    public Result onUnauthorized(Http.Context ctx) {
        ObjectNode response = Json.newObject();
        response.put("error", 1);
        response.put("description", "Invalid User");
        return forbidden(response);
    }



}