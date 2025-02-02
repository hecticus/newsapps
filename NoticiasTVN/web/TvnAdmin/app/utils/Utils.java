package utils;

import job.ThreadSupervisor;
import models.Config;
import models.basic.Instance;
import org.apache.commons.codec.digest.DigestUtils;
import play.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.security.MessageDigest;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.TimeZone;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by sorcerer on 3/7/14.
 */
public class Utils {

    public static AtomicBoolean run;
    public static ThreadSupervisor supervisor;
    public static String serverIp;
    public static Instance actual;
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

    //old format
    public static long formatDateLongFromString(String dateString) {
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
        return Long.parseLong(YYYY+MM+DD+hh+mm+ss);
    }

    //new format
    public static long formatDateLongFromStringNew(String dateString) {
        String YYYY,MM,DD;
        String hh="00";
        String mm="00";
        String ss="00";
        String[] parts = dateString.split(" ");
        String[] MDY = parts[0].split("/");
        DD = MDY[0];
        MM = MDY[1];
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
        if ( MMint < 10 && MM.charAt(0) != '0' ) MM = '0' + MM;

        //console.log("Date: "+ds+" -- "+YYYY+MM+DD+hh+mm+ss);
        return Long.parseLong(YYYY+MM+DD+hh+mm+ss);
    }

    public static String getMD5(File f) throws Exception  {
        MessageDigest md = MessageDigest.getInstance("MD5");
        FileInputStream fis = new FileInputStream(f);
        byte[] dataBytes = new byte[1024];
        int nread = 0;
        while ((nread = fis.read(dataBytes)) != -1) {
            md.update(dataBytes, 0, nread);
        }
        byte[] mdbytes = md.digest();

        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < mdbytes.length; i++) {
            sb.append(Integer.toString((mdbytes[i] & 0xff) + 0x100, 16).substring(1));
        }

        return sb.toString();
    }

    public static void printToLog(Object invoker, String title, String description, boolean sendMail, Throwable ex, String supportLevel, int loggerErrorType){
        //Logger tempLogger = LoggerFactory.getLogger(invoker.getClass());
        //Logger tempLogger = Logger.getLogger(invoker.getClass());
        StringBuilder message = new StringBuilder();
        if(invoker!=null){
            message.append(invoker);
        }
        message.append("{");
        if(!sendMail && title!=null && !title.isEmpty()){
            message.append(title);
            message.append(". ");
        }
        message.append(description);
        message.append("}");
        switch(loggerErrorType){
            case Config.LOGGER_ERROR:
                if(ex == null){
                    Logger.error(message.toString());
                }else{
                    Logger.error(message.toString(),ex);
                }
                break;
            case Config.LOGGER_INFO:
                if(ex == null){
                    Logger.info(message.toString());
                }else{
                    Logger.info(message.toString(),ex);
                }
                break;
            case Config.LOGGER_WARN:
                if(ex == null){
                    Logger.warn(message.toString());
                }else{
                    Logger.warn(message.toString(),ex);
                }
                break;
            case Config.LOGGER_DEBUG:
                if(ex == null){
                    Logger.debug(message.toString());
                }else{
                    Logger.debug(message.toString(),ex);
                }
                break;
            case Config.LOGGER_TRACE:
                if(ex == null){
                    Logger.trace(message.toString());
                }else{
                    Logger.trace(message.toString(),ex);
                }
                break;
        }

//        if(sendMail){
//            if(ex==null){
//                Alarm.sendMail(Config.getStringArray(supportLevel, ";"), title, message.toString());
//            }else{
//                Alarm.sendMail(Config.getStringArray(supportLevel, ";"), title, message.toString(),ex);
//            }
//        }
    }

}
