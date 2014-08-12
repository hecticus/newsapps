package utils;

import models.Config;
import org.apache.commons.codec.digest.DigestUtils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

/**
 * Created by sorcerer on 3/7/14.
 */
public class Utils {

    public static final TimeZone APP_TIMEZONE = TimeZone.getTimeZone("America/Panama");

    /***
     * Funcion que devuelve el timestamp actual en formato YYYYMMDDHHMMSS
     * @param tz	timezone a consultar
     * @return		fecha en formato YYYYMMDDHHMMSS
     */
    public static long currentTimeStamp(TimeZone tz) {

        Calendar actualDate = new GregorianCalendar(tz);
        int auxMonth = actualDate.get(Calendar.MONTH) + 1;
        int auxDay = actualDate.get(Calendar.DAY_OF_MONTH);
        int auxHour = actualDate.get(Calendar.HOUR_OF_DAY);
        int auxMinute = actualDate.get(Calendar.MINUTE);
        int auxSecond = actualDate.get(Calendar.SECOND);

        StringBuffer fechaInicio = new StringBuffer(12);
        fechaInicio.append(actualDate.get(Calendar.YEAR));
        if (auxMonth < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxMonth);
        if (auxDay < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxDay);
        if (auxHour < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxHour);
        if (auxMinute < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxMinute);
        if (auxSecond < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxSecond);


        return Long.parseLong(fechaInicio.toString());
        //return Long.parseLong("20150612000000");
    }

    /***
     * Funcion que devuelve el timestamp actual en formato YYYYMMDD sin las horas minutos ni segundos
     * @param tz	timezone a consultar
     * @return		fecha en formato YYYYMMDD
     */
    public static long currentTimeStampToDate(TimeZone tz) {

        Calendar actualDate = new GregorianCalendar(tz);
        int auxMonth = actualDate.get(Calendar.MONTH) + 1;
        int auxDay = actualDate.get(Calendar.DAY_OF_MONTH);

        StringBuffer fechaInicio = new StringBuffer(12);
        fechaInicio.append(actualDate.get(Calendar.YEAR));
        if (auxMonth < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxMonth);
        if (auxDay < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxDay);

        return Long.parseLong(fechaInicio.toString());
    }

    /**
     * Funcion que devuelve el timestamp a convertir en formato YYYYMMDDHHmmSS
     * @param actualDate	fecha a convertir
     * @return				fecha en formato YYYYMMDDHHmmSS
     */
    public static String convertTimeStamp(GregorianCalendar actualDate) {

        int auxMonth = actualDate.get(Calendar.MONTH) + 1;
        int auxDay = actualDate.get(Calendar.DAY_OF_MONTH);
        int auxHour = actualDate.get(Calendar.HOUR_OF_DAY);
        int auxMinute = actualDate.get(Calendar.MINUTE);
        int auxSecond = actualDate.get(Calendar.SECOND);

        StringBuffer fechaInicio = new StringBuffer(12);
        fechaInicio.append(actualDate.get(Calendar.YEAR));
        if (auxMonth < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxMonth);
        if (auxDay < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxDay);
        if (auxHour < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxHour);
        if (auxMinute < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxMinute);
        if (auxSecond < 10) {
            fechaInicio.append("0");
        }
        fechaInicio.append(auxSecond);


        return fechaInicio.toString();
    }

    public static String createMd5(String message){
        String tr = DigestUtils.md5Hex(message);
        return tr;
    }

    /**
     * Funcion que transforma una fecha del tipo MM/dd/yyyy hh:mm:ss t.t. o M/d/yyyy h:m:s t.t. o solo the month/day/year
     * @param dateString
     * @return
     */
    public static String formatDateStringForSorting(String dateString) {
        String YYYY,MM,DD;
        String hh="00";
        String mm="00";
        String ss="00";
        String[] parts = dateString.split(" ");
        String[] MDY = parts[0].split("/");
        MM = MDY[0];
        DD = MDY[1];
        YYYY = MDY[2];
        if(parts.length > 1){

            String[] HMS = parts[1].split(":");
            String meridian = parts[2];
            int intH = Integer.parseInt(HMS[0]);
            if(meridian.equalsIgnoreCase("p.m.") || meridian.equalsIgnoreCase("p.m") || meridian.equalsIgnoreCase("pm")){
                if(intH < 12){
                    intH = intH+12;
                }
            }
            if ( intH < 10 ){
                hh = "0" + intH;
            }else{
                hh = ""+intH;
            }
            mm = HMS[1];
            ss = HMS[2];

        }
        int MMint = Integer.parseInt(MM);
        if ( MMint < 10 && MM.charAt(0) != '0' ) MM = '0' + MM;

        //console.log("Date: "+ds+" -- "+YYYY+MM+DD+hh+mm+ss);
        return ""+YYYY+MM+DD+hh+mm+ss;
    }

    public static long formatDateLongFromStringNew(String dateString) {
        String YYYY,MM,DD;
        String hh="00";
        String mm="00";
        String ss="00";
        String[] parts = dateString.split(" ");
        String[] MDY = parts[0].split("/");
        DD = MDY[1];
        MM = MDY[0];
        YYYY = MDY[2];
        if(parts.length > 1){

            String[] HMS = parts[1].split(":");
            String meridian = parts[2];
            int intH = Integer.parseInt(HMS[0]);
            if(meridian.equalsIgnoreCase("p.m.") || meridian.equalsIgnoreCase("p.m") || meridian.equalsIgnoreCase("pm")){
                if(intH < 12){
                    intH = intH+12;
                }
            }
            if ( intH < 10 ){
                hh = "0" + intH;
            }else{
                hh = ""+intH;
            }

            //mm = HMS[1];
            int minutesS = Integer.parseInt(HMS[1]);
            if (minutesS < 10){
                mm = "0"+ minutesS;
            }else {
                mm = ""+ minutesS;
            }
            ss = "00";

        }
        int MMint = Integer.parseInt(MM);
        if ( MMint < 10) MM = '0' + MM;

        //console.log("Date: "+ds+" -- "+YYYY+MM+DD+hh+mm+ss);
        return Long.parseLong(YYYY+MM+DD+hh+mm+ss);
    }

    public static String formatCalendarDate(String value, String tz) {
        try {
            Calendar today = new GregorianCalendar(Utils.APP_TIMEZONE);
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MMM h:mm a");
            sdf.setTimeZone(TimeZone.getTimeZone(tz));
            Date dateStr = sdf.parse(value);
            SimpleDateFormat aux = new SimpleDateFormat("yyyyMMddHHmmss");
            aux.setTimeZone(TimeZone.getTimeZone(tz));
            Calendar pre = new GregorianCalendar(TimeZone.getTimeZone(tz));
            pre.setTime(dateStr);
            pre.setTimeZone(TimeZone.getTimeZone(tz));
            pre.set(Calendar.YEAR, today.get(Calendar.YEAR));
            return aux.format(pre.getTime());
        }catch (Exception ex){
            return "";
        }
    }

    public static String fanaticos412Date(String value, String tz) {
        try {
            Calendar today = new GregorianCalendar(TimeZone.getTimeZone(tz));
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MMM h:mm a");
            sdf.setTimeZone(Utils.APP_TIMEZONE);
            Date dateStr = sdf.parse(value);

            SimpleDateFormat aux = new SimpleDateFormat("dd/MMM h:mm a");
            aux.setTimeZone(TimeZone.getTimeZone(tz));

            Calendar pre = new GregorianCalendar(TimeZone.getTimeZone(tz));
            pre.setTime(dateStr);
            pre.setTimeZone(Utils.APP_TIMEZONE);
            pre.set(Calendar.YEAR, today.get(Calendar.YEAR));

            return aux.format(pre.getTime());
        }catch (Exception ex){
            return "";
        }
    }

    public static String getUpdateVersionURL(int version, String os){
        int versionServer = 0;
        String url = "";
        boolean differentVersion = false;
        if(os.contains("droid")){
            //is android
            versionServer = Config.getInt("app_version_android");
            if(version<versionServer){
                url = Config.getString("android_app_url");
                differentVersion = true;
            }
        }else{
            //is ios
            versionServer = Config.getInt("app_version_ios");
            if(version<versionServer){
                url = Config.getString("ios_app_url");
                differentVersion = true;
            }
        }

        if(differentVersion){
            return url;
        }else{
            return null;
        }
    }

}
