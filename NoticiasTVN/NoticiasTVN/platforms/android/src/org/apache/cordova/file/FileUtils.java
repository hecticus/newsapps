/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */
package org.apache.cordova.file;

import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.MediaStore.MediaColumns;
import android.util.Base64;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.channels.FileChannel;

/**
 * This class provides SD card file and directory services to JavaScript.
 * Only files on the SD card can be accessed.
 */
public class FileUtils extends CordovaPlugin {
    private static final String LOG_TAG = "FileUtils";

    public static int NOT_FOUND_ERR = 1;
    public static int SECURITY_ERR = 2;
    public static int ABORT_ERR = 3;

    public static int NOT_READABLE_ERR = 4;
    public static int ENCODING_ERR = 5;
    public static int NO_MODIFICATION_ALLOWED_ERR = 6;
    public static int INVALID_STATE_ERR = 7;
    public static int SYNTAX_ERR = 8;
    public static int INVALID_MODIFICATION_ERR = 9;
    public static int QUOTA_EXCEEDED_ERR = 10;
    public static int TYPE_MISMATCH_ERR = 11;
    public static int PATH_EXISTS_ERR = 12;

    public static int TEMPORARY = 0;
    public static int PERSISTENT = 1;
    public static int RESOURCE = 2;
    public static int APPLICATION = 3;

    private interface FileOp {
        void run(  ) throws Exception;
    }

    /**
     * Executes the request and returns whether the action was valid.
     *
     * @param action 		The action to execute.
     * @param args 		JSONArray of arguments for the plugin.
     * @param callbackContext	The callback context used when calling back into JavaScript.
     * @return 			True if the action was valid, false otherwise.
     */
    @Override
	public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equals("testSaveLocationExists")) {
            threadhelper( new FileOp( ){
                @Override
				public void run() {
                    boolean b = DirectoryManager.testSaveLocationExists();
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, b));
                }
            },callbackContext);
        }
        else if (action.equals("getFreeDiskSpace")) {
            threadhelper( new FileOp( ){
                @Override
				public void run() {
                    long l = DirectoryManager.getFreeDiskSpace(false);
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, l));
                }
            },callbackContext);
        }
        else if (action.equals("testFileExists")) {
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() {
                    boolean b = DirectoryManager.testFileExists(fname);
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, b));
                }
            }, callbackContext);
        }
        else if (action.equals("testDirectoryExists")) {
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() {
                    boolean b = DirectoryManager.testFileExists(fname);
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, b));
                }
            }, callbackContext);
        }
        else if (action.equals("readAsText")) {
            final String encoding = args.getString(1);
            final int start = args.getInt(2);
            final int end = args.getInt(3);
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() {
                    readFileAs(fname, start, end, callbackContext, encoding, PluginResult.MESSAGE_TYPE_STRING);
                }
            }, callbackContext);
        }
        else if (action.equals("readAsDataURL")) {
            final int start = args.getInt(1);
            final int end = args.getInt(2);
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run()  {
                    readFileAs(fname, start, end, callbackContext, null, -1);
                }
            }, callbackContext);
        }
        else if (action.equals("readAsArrayBuffer")) {
            final int start = args.getInt(1);
            final int end = args.getInt(2);
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run()  {
                    readFileAs(fname, start, end, callbackContext, null, PluginResult.MESSAGE_TYPE_ARRAYBUFFER);
                }
            },callbackContext);
        }
        else if (action.equals("readAsBinaryString")) {
            final int start = args.getInt(1);
            final int end = args.getInt(2);
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run()  {
                    readFileAs(fname, start, end, callbackContext, null, PluginResult.MESSAGE_TYPE_BINARYSTRING);
                }
            }, callbackContext);
        }
        else if (action.equals("write")) {
            final String fname=args.getString(0);
            final String data=args.getString(1);
            final int offset=args.getInt(2);
            final Boolean isBinary=args.getBoolean(3);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws FileNotFoundException, IOException, NoModificationAllowedException {
                    long fileSize = write(fname, data, offset, isBinary);
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, fileSize));
                }
            }, callbackContext);
        }
        else if (action.equals("truncate")) {
            final String fname=args.getString(0);
            final int offset=args.getInt(1);
            threadhelper( new FileOp( ){
                @Override
				public void run( ) throws FileNotFoundException, IOException, NoModificationAllowedException {
                    long fileSize = truncateFile(fname, offset);
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, fileSize));
                }
            }, callbackContext);
        }
        else if (action.equals("requestFileSystem")) {
            final int fstype=args.getInt(0);
            final long size = args.optLong(1);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws IOException, JSONException {
                    if (size != 0 && size > (DirectoryManager.getFreeDiskSpace(true) * 1024)) {
                        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, FileUtils.QUOTA_EXCEEDED_ERR));
                    } else {
                        JSONObject obj = requestFileSystem(fstype);
                        callbackContext.success(obj);
                    }
                }
            }, callbackContext);
        }
        else if (action.equals("resolveLocalFileSystemURI")) {
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws IOException, JSONException {
                    JSONObject obj = resolveLocalFileSystemURI(fname);
                    callbackContext.success(obj);
                }
            },callbackContext);
        }
        else if (action.equals("getMetadata")) {
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws FileNotFoundException, JSONException {
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, getMetadata(fname)));
                }
            }, callbackContext);
        }
        else if (action.equals("getFileMetadata")) {
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws FileNotFoundException, JSONException {
                    JSONObject obj = getFileMetadata(fname);
                    callbackContext.success(obj);
                }
            },callbackContext);
        }
        else if (action.equals("getParent")) {
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws JSONException {
                    JSONObject obj = getParent(fname);
                    callbackContext.success(obj);
                }
            },callbackContext);
        }
        else if (action.equals("getDirectory")) {
            final String dirname=args.getString(0);
            final String fname=args.getString(1);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws FileExistsException, IOException, TypeMismatchException, EncodingException, JSONException {
                   JSONObject obj = getFile(dirname, fname, args.optJSONObject(2), true);
                   callbackContext.success(obj);
                }
            },callbackContext);
        }
        else if (action.equals("getFile")) {
            final String dirname=args.getString(0);
            final String fname=args.getString(1);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws FileExistsException, IOException, TypeMismatchException, EncodingException, JSONException {
                    JSONObject obj = getFile(dirname, fname, args.optJSONObject(2), false);
                    callbackContext.success(obj);
                }
            },callbackContext);
        }
        else if (action.equals("remove")) {
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws NoModificationAllowedException, InvalidModificationException {
                    boolean success= remove(fname);
                    if (success) {
                        notifyDelete(fname);
                        callbackContext.success();
                    } else {
                        callbackContext.error(FileUtils.NO_MODIFICATION_ALLOWED_ERR);
                    }
                }
            },callbackContext);
        }
        else if (action.equals("removeRecursively")) {
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws FileExistsException {
                    boolean success = removeRecursively(fname);
                    if (success) {
                        callbackContext.success();
                    } else {
                        callbackContext.error(FileUtils.NO_MODIFICATION_ALLOWED_ERR);
                    }
                }
            },callbackContext);
        }
        else if (action.equals("moveTo")) {
            final String fname=args.getString(0);
            final String newParent=args.getString(1);
            final String newName=args.getString(2);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws JSONException, NoModificationAllowedException, IOException, InvalidModificationException, EncodingException, FileExistsException {
                    JSONObject entry = transferTo(fname, newParent, newName, true);
                    callbackContext.success(entry);
                }
            },callbackContext);
        }
        else if (action.equals("copyTo")) {
            final String fname=args.getString(0);
            final String newParent=args.getString(1);
            final String newName=args.getString(2);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws JSONException, NoModificationAllowedException, IOException, InvalidModificationException, EncodingException, FileExistsException {
                    JSONObject entry = transferTo(fname, newParent, newName, false);
                    callbackContext.success(entry);
                }
            },callbackContext);
        }
        else if (action.equals("readEntries")) {
            final String fname=args.getString(0);
            threadhelper( new FileOp( ){
                @Override
				public void run() throws FileNotFoundException, JSONException {
                    JSONArray entries = readEntries(fname);
                    callbackContext.success(entries);
                }
            },callbackContext);
        }
        else {
            return false;
        }
        return true;
    }

    /* helper to execute functions async and handle the result codes
     *
     */
    private void threadhelper(final FileOp f, final CallbackContext callbackContext){
        cordova.getThreadPool().execute(new Runnable() {
            @Override
			public void run() {
                try {
                    f.run();
                } catch ( Exception e) {
                    e.printStackTrace();
                    if( e instanceof EncodingException){
                        callbackContext.error(FileUtils.ENCODING_ERR);
                    } else if(e instanceof FileNotFoundException) {
                        callbackContext.error(FileUtils.NOT_FOUND_ERR);
                    } else if(e instanceof FileExistsException) {
                        callbackContext.error(FileUtils.PATH_EXISTS_ERR);
                    } else if(e instanceof NoModificationAllowedException ) {
                        callbackContext.error(FileUtils.NO_MODIFICATION_ALLOWED_ERR);
                    } else if(e instanceof InvalidModificationException ) {
                        callbackContext.error(FileUtils.INVALID_MODIFICATION_ERR);
                    } else if(e instanceof MalformedURLException ) {
                        callbackContext.error(FileUtils.ENCODING_ERR);
                    } else if(e instanceof IOException ) {
                        callbackContext.error(FileUtils.INVALID_MODIFICATION_ERR);
                    } else if(e instanceof EncodingException ) {
                        callbackContext.error(FileUtils.ENCODING_ERR);
                    } else if(e instanceof TypeMismatchException ) {
                        callbackContext.error(FileUtils.TYPE_MISMATCH_ERR);
                    }
                }
            }
        });
    }

    /**
     * Need to check to see if we need to clean up the content store
     *
     * @param filePath the path to check
     */
    private void notifyDelete(String filePath) {
        String newFilePath = FileHelper.getRealPath(filePath, cordova);
        try {
            this.cordova.getActivity().getContentResolver().delete(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                    MediaColumns.DATA + " = ?",
                    new String[] { newFilePath });
        } catch (UnsupportedOperationException t) {
            // Was seeing this on the File mobile-spec tests on 4.0.3 x86 emulator.
            // The ContentResolver applies only when the file was registered in the
            // first case, which is generally only the case with images.
        }
    }

    /**
     * Allows the user to look up the Entry for a file or directory referred to by a local URI.
     *
     * @param url of the file/directory to look up
     * @return a JSONObject representing a Entry from the filesystem
     * @throws MalformedURLException if the url is not valid
     * @throws FileNotFoundException if the file does not exist
     * @throws IOException if the user can't read the file
     * @throws JSONException
     */
    @SuppressWarnings("deprecation")
    private JSONObject resolveLocalFileSystemURI(String url) throws IOException, JSONException {
        String decoded = URLDecoder.decode(url, "UTF-8");

        File fp = null;

        // Handle the special case where you get an Android content:// uri.
        if (decoded.startsWith("content:")) {
            Cursor cursor = this.cordova.getActivity().managedQuery(Uri.parse(decoded), new String[] { MediaColumns.DATA }, null, null, null);
            // Note: MediaStore.Images/Audio/Video.Media.DATA is always "_data"
            int column_index = cursor.getColumnIndexOrThrow(MediaColumns.DATA);
            cursor.moveToFirst();
            fp = new File(cursor.getString(column_index));
        } else {
            // Test to see if this is a valid URL first
            @SuppressWarnings("unused")
            URL testUrl = new URL(decoded);

            if (decoded.startsWith("file://")) {
                int questionMark = decoded.indexOf("?");
                if (questionMark < 0) {
                    fp = new File(decoded.substring(7, decoded.length()));
                } else {
                    fp = new File(decoded.substring(7, questionMark));
                }
            } else {
                fp = new File(decoded);
            }
        }

        if (!fp.exists()) {
            throw new FileNotFoundException();
        }
        if (!fp.canRead()) {
            throw new IOException();
        }
        return getEntry(fp);
    }

    /**
     * Read the list of files from this directory.
     *
     * @param fileName the directory to read from
     * @return a JSONArray containing JSONObjects that represent Entry objects.
     * @throws FileNotFoundException if the directory is not found.
     * @throws JSONException
     */
    private JSONArray readEntries(String fileName) throws FileNotFoundException, JSONException {
        File fp = createFileObject(fileName);

        if (!fp.exists()) {
            // The directory we are listing doesn't exist so we should fail.
            throw new FileNotFoundException();
        }

        JSONArray entries = new JSONArray();

        if (fp.isDirectory()) {
            File[] files = fp.listFiles();
            for (int i = 0; i < files.length; i++) {
                if (files[i].canRead()) {
                    entries.put(getEntry(files[i]));
                }
            }
        }

        return entries;
    }

    /**
     * A setup method that handles the move/copy of files/directories
     *
     * @param fileName to be copied/moved
     * @param newParent is the location where the file will be copied/moved to
     * @param newName for the file directory to be called, if null use existing file name
     * @param move if false do a copy, if true do a move
     * @return a Entry object
     * @throws NoModificationAllowedException
     * @throws IOException
     * @throws InvalidModificationException
     * @throws EncodingException
     * @throws JSONException
     * @throws FileExistsException
     */
    private JSONObject transferTo(String fileName, String newParent, String newName, boolean move) throws JSONException, NoModificationAllowedException, IOException, InvalidModificationException, EncodingException, FileExistsException {
        String newFileName = FileHelper.getRealPath(fileName, cordova);
        newParent = FileHelper.getRealPath(newParent, cordova);

        // Check for invalid file name
        if (newName != null && newName.contains(":")) {
            throw new EncodingException("Bad file name");
        }

        File source = new File(newFileName);

        if (!source.exists()) {
            // The file/directory we are copying doesn't exist so we should fail.
            throw new FileNotFoundException("The source does not exist");
        }

        File destinationDir = new File(newParent);
        if (!destinationDir.exists()) {
            // The destination does not exist so we should fail.
            throw new FileNotFoundException("The source does not exist");
        }

        // Figure out where we should be copying to
        File destination = createDestination(newName, source, destinationDir);

        //Log.d(LOG_TAG, "Source: " + source.getAbsolutePath());
        //Log.d(LOG_TAG, "Destin: " + destination.getAbsolutePath());

        // Check to see if source and destination are the same file
        if (source.getAbsolutePath().equals(destination.getAbsolutePath())) {
            throw new InvalidModificationException("Can't copy a file onto itself");
        }

        if (source.isDirectory()) {
            if (move) {
                return moveDirectory(source, destination);
            } else {
                return copyDirectory(source, destination);
            }
        } else {
            if (move) {
                JSONObject newFileEntry = moveFile(source, destination);

                // If we've moved a file given its content URI, we need to clean up.
                if (fileName.startsWith("content://")) {
                    notifyDelete(fileName);
                }

                return newFileEntry;
            } else {
                return copyFile(source, destination);
            }
        }
    }

    /**
     * Creates the destination File object based on name passed in
     *
     * @param newName for the file directory to be called, if null use existing file name
     * @param fp represents the source file
     * @param destination represents the destination file
     * @return a File object that represents the destination
     */
    private File createDestination(String newName, File fp, File destination) {
        File destFile = null;

        // I know this looks weird but it is to work around a JSON bug.
        if ("null".equals(newName) || "".equals(newName)) {
            newName = null;
        }

        if (newName != null) {
            destFile = new File(destination.getAbsolutePath() + File.separator + newName);
        } else {
            destFile = new File(destination.getAbsolutePath() + File.separator + fp.getName());
        }
        return destFile;
    }

    /**
     * Copy a file
     *
     * @param srcFile file to be copied
     * @param destFile destination to be copied to
     * @return a FileEntry object
     * @throws IOException
     * @throws InvalidModificationException
     * @throws JSONException
     */
    private JSONObject copyFile(File srcFile, File destFile) throws IOException, InvalidModificationException, JSONException {
        // Renaming a file to an existing directory should fail
        if (destFile.exists() && destFile.isDirectory()) {
            throw new InvalidModificationException("Can't rename a file to a directory");
        }

        copyAction(srcFile, destFile);

        return getEntry(destFile);
    }

    /**
     * Moved this code into it's own method so moveTo could use it when the move is across file systems
     */
    private void copyAction(File srcFile, File destFile)
            throws FileNotFoundException, IOException {
        FileInputStream istream = new FileInputStream(srcFile);
        FileOutputStream ostream = new FileOutputStream(destFile);
        FileChannel input = istream.getChannel();
        FileChannel output = ostream.getChannel();

        try {
            input.transferTo(0, input.size(), output);
        } finally {
            istream.close();
            ostream.close();
            input.close();
            output.close();
        }
    }

    /**
     * Copy a directory
     *
     * @param srcDir directory to be copied
     * @param destinationDir destination to be copied to
     * @return a DirectoryEntry object
     * @throws JSONException
     * @throws IOException
     * @throws NoModificationAllowedException
     * @throws InvalidModificationException
     */
    private JSONObject copyDirectory(File srcDir, File destinationDir) throws JSONException, IOException, NoModificationAllowedException, InvalidModificationException {
        // Renaming a file to an existing directory should fail
        if (destinationDir.exists() && destinationDir.isFile()) {
            throw new InvalidModificationException("Can't rename a file to a directory");
        }

        // Check to make sure we are not copying the directory into itself
        if (isCopyOnItself(srcDir.getAbsolutePath(), destinationDir.getAbsolutePath())) {
            throw new InvalidModificationException("Can't copy itself into itself");
        }

        // See if the destination directory exists. If not create it.
        if (!destinationDir.exists()) {
            if (!destinationDir.mkdir()) {
                // If we can't create the directory then fail
                throw new NoModificationAllowedException("Couldn't create the destination directory");
            }
        }
        

        for (File file : srcDir.listFiles()) {
            File destination = new File(destinationDir.getAbsoluteFile() + File.separator + file.getName());
            if (file.isDirectory()) {
                copyDirectory(file, destination);
            } else {
                copyFile(file, destination);
            }
        }

        return getEntry(destinationDir);
    }

    /**
     * Check to see if the user attempted to copy an entry into its parent without changing its name,
     * or attempted to copy a directory into a directory that it contains directly or indirectly.
     *
     * @param srcDir
     * @param destinationDir
     * @return
     */
    private boolean isCopyOnItself(String src, String dest) {

        // This weird test is to determine if we are copying or moving a directory into itself.
        // Copy /sdcard/myDir to /sdcard/myDir-backup is okay but
        // Copy /sdcard/myDir to /sdcard/myDir/backup should throw an INVALID_MODIFICATION_ERR
        if (dest.startsWith(src) && dest.indexOf(File.separator, src.length() - 1) != -1) {
            return true;
        }

        return false;
    }

    /**
     * Move a file
     *
     * @param srcFile file to be copied
     * @param destFile destination to be copied to
     * @return a FileEntry object
     * @throws IOException
     * @throws InvalidModificationException
     * @throws JSONException
     */
    private JSONObject moveFile(File srcFile, File destFile) throws IOException, JSONException, InvalidModificationException {
        // Renaming a file to an existing directory should fail
        if (destFile.exists() && destFile.isDirectory()) {
            throw new InvalidModificationException("Can't rename a file to a directory");
        }

        // Try to rename the file
        if (!srcFile.renameTo(destFile)) {
            // Trying to rename the file failed.  Possibly because we moved across file system on the device.
            // Now we have to do things the hard way
            // 1) Copy all the old file
            // 2) delete the src file
            copyAction(srcFile, destFile);
            if (destFile.exists()) {
                srcFile.delete();
            } else {
                throw new IOException("moved failed");
            }
        }

        return getEntry(destFile);
    }

    /**
     * Move a directory
     *
     * @param srcDir directory to be copied
     * @param destinationDir destination to be copied to
     * @return a DirectoryEntry object
     * @throws JSONException
     * @throws IOException
     * @throws InvalidModificationException
     * @throws NoModificationAllowedException
     * @throws FileExistsException
     */
    private JSONObject moveDirectory(File srcDir, File destinationDir) throws IOException, JSONException, InvalidModificationException, NoModificationAllowedException, FileExistsException {
        // Renaming a file to an existing directory should fail
        if (destinationDir.exists() && destinationDir.isFile()) {
            throw new InvalidModificationException("Can't rename a file to a directory");
        }

        // Check to make sure we are not copying the directory into itself
        if (isCopyOnItself(srcDir.getAbsolutePath(), destinationDir.getAbsolutePath())) {
            throw new InvalidModificationException("Can't move itself into itself");
        }

        // If the destination directory already exists and is empty then delete it.  This is according to spec.
        if (destinationDir.exists()) {
            if (destinationDir.list().length > 0) {
                throw new InvalidModificationException("directory is not empty");
            }
        }

        // Try to rename the directory
        if (!srcDir.renameTo(destinationDir)) {
            // Trying to rename the directory failed.  Possibly because we moved across file system on the device.
            // Now we have to do things the hard way
            // 1) Copy all the old files
            // 2) delete the src directory
            copyDirectory(srcDir, destinationDir);
            if (destinationDir.exists()) {
                removeDirRecursively(srcDir);
            } else {
                throw new IOException("moved failed");
            }
        }

        return getEntry(destinationDir);
    }

    /**
     * Deletes a directory and all of its contents, if any. In the event of an error
     * [e.g. trying to delete a directory that contains a file that cannot be removed],
     * some of the contents of the directory may be deleted.
     * It is an error to attempt to delete the root directory of a filesystem.
     *
     * @param filePath the directory to be removed
     * @return a boolean representing success of failure
     * @throws FileExistsException
     */
    private boolean removeRecursively(String filePath) throws FileExistsException {
        File fp = createFileObject(filePath);

        // You can't delete the root directory.
        if (atRootDirectory(filePath)) {
            return false;
        }

        return removeDirRecursively(fp);
    }

    /**
     * Loops through a directory deleting all the files.
     *
     * @param directory to be removed
     * @return a boolean representing success of failure
     * @throws FileExistsException
     */
    private boolean removeDirRecursively(File directory) throws FileExistsException {
        if (directory.isDirectory()) {
            for (File file : directory.listFiles()) {
                removeDirRecursively(file);
            }
        }

        if (!directory.delete()) {
            throw new FileExistsException("could not delete: " + directory.getName());
        } else {
            return true;
        }
    }

    /**
     * Deletes a file or directory. It is an error to attempt to delete a directory that is not empty.
     * It is an error to attempt to delete the root directory of a filesystem.
     *
     * @param filePath file or directory to be removed
     * @return a boolean representing success of failure
     * @throws NoModificationAllowedException
     * @throws InvalidModificationException
     */
    private boolean remove(String filePath) throws NoModificationAllowedException, InvalidModificationException {
        File fp = createFileObject(filePath);

        // You can't delete the root directory.
        if (atRootDirectory(filePath)) {
            throw new NoModificationAllowedException("You can't delete the root directory");
        }

        // You can't delete a directory that is not empty
        if (fp.isDirectory() && fp.list().length > 0) {
            throw new InvalidModificationException("You can't delete a directory that is not empty.");
        }

        return fp.delete();
    }

    /**
     * Creates or looks up a file.
     *
     * @param dirPath base directory
     * @param fileName file/directory to lookup or create
     * @param options specify whether to create or not
     * @param directory if true look up directory, if false look up file
     * @return a Entry object
     * @throws FileExistsException
     * @throws IOException
     * @throws TypeMismatchException
     * @throws EncodingException
     * @throws JSONException
     */
    private JSONObject getFile(String dirPath, String fileName, JSONObject options, boolean directory) throws FileExistsException, IOException, TypeMismatchException, EncodingException, JSONException {
        boolean create = false;
        boolean exclusive = false;
        if (options != null) {
            create = options.optBoolean("create");
            if (create) {
                exclusive = options.optBoolean("exclusive");
            }
        }

        // Check for a ":" character in the file to line up with BB and iOS
        if (fileName.contains(":")) {
            throw new EncodingException("This file has a : in it's name");
        }

        File fp = createFileObject(dirPath, fileName);

        if (create) {
            if (exclusive && fp.exists()) {
                throw new FileExistsException("create/exclusive fails");
            }
            if (directory) {
                fp.mkdir();
            } else {
                fp.createNewFile();
            }
            if (!fp.exists()) {
                throw new FileExistsException("create fails");
            }
        }
        else {
            if (!fp.exists()) {
                throw new FileNotFoundException("path does not exist");
            }
            if (directory) {
                if (fp.isFile()) {
                    throw new TypeMismatchException("path doesn't exist or is file");
                }
            } else {
                if (fp.isDirectory()) {
                    throw new TypeMismatchException("path doesn't exist or is directory");
                }
            }
        }

        // Return the directory
        return getEntry(fp);
    }

    /**
     * If the path starts with a '/' just return that file object. If not construct the file
     * object from the path passed in and the file name.
     *
     * @param dirPath root directory
     * @param fileName new file name
     * @return
     */
    private File createFileObject(String dirPath, String fileName) {
        File fp = null;
        if (fileName.startsWith("/")) {
            fp = new File(fileName);
        } else {
            dirPath = FileHelper.getRealPath(dirPath, cordova);
            fp = new File(dirPath + File.separator + fileName);
        }
        return fp;
    }

    /**
     * Look up the parent DirectoryEntry containing this Entry.
     * If this Entry is the root of its filesystem, its parent is itself.
     *
     * @param filePath
     * @return
     * @throws JSONException
     */
    private JSONObject getParent(String filePath) throws JSONException {
        filePath = FileHelper.getRealPath(filePath, cordova);

        if (atRootDirectory(filePath)) {
            return getEntry(filePath);
        }
        return getEntry(new File(filePath).getParent());
    }

    /**
     * Checks to see if we are at the root directory.  Useful since we are
     * not allow to delete this directory.
     *
     * @param filePath to directory
     * @return true if we are at the root, false otherwise.
     */
    private boolean atRootDirectory(String filePath) {
        filePath = FileHelper.getRealPath(filePath, cordova);

        if (filePath.equals(Environment.getExternalStorageDirectory().getAbsolutePath() + "/Android/data/" + cordova.getActivity().getPackageName() + "/cache") ||
                filePath.equals(Environment.getExternalStorageDirectory().getAbsolutePath()) ||
                filePath.equals("/data/data/" + cordova.getActivity().getPackageName())) {
            return true;
        }
        return false;
    }

    /**
     * Create a File object from the passed in path
     *
     * @param filePath
     * @return
     */
    private File createFileObject(String filePath) {
        filePath = FileHelper.getRealPath(filePath, cordova);

        File file = new File(filePath);
        return file;
    }

    /**
     * Look up metadata about this entry.
     *
     * @param filePath to entry
     * @return a long
     * @throws FileNotFoundException
     */
    private long getMetadata(String filePath) throws FileNotFoundException {
        File file = createFileObject(filePath);

        if (!file.exists()) {
            throw new FileNotFoundException("Failed to find file in getMetadata");
        }

        return file.lastModified();
    }

    /**
     * Returns a File that represents the current state of the file that this FileEntry represents.
     *
     * @param filePath to entry
     * @return returns a JSONObject represent a W3C File object
     * @throws FileNotFoundException
     * @throws JSONException
     */
    private JSONObject getFileMetadata(String filePath) throws FileNotFoundException, JSONException {
        File file = createFileObject(filePath);

        if (!file.exists()) {
            throw new FileNotFoundException("File: " + filePath + " does not exist.");
        }

        JSONObject metadata = new JSONObject();
        metadata.put("size", file.length());
        metadata.put("type", FileHelper.getMimeType(filePath, cordova));
        metadata.put("name", file.getName());
        metadata.put("fullPath", filePath);
        metadata.put("lastModifiedDate", file.lastModified());

        return metadata;
    }

    /**
     * Requests a filesystem in which to store application data.
     *
     * @param type of file system requested
     * @return a JSONObject representing the file system
     * @throws IOException
     * @throws JSONException
     */
    private JSONObject requestFileSystem(int type) throws IOException, JSONException {
        JSONObject fs = new JSONObject();
        if (type == TEMPORARY) {
            File fp;
            fs.put("name", "temporary");
            if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
                fp = new File(Environment.getExternalStorageDirectory().getAbsolutePath() +
                        "/Android/data/" + cordova.getActivity().getPackageName() + "/cache/");
                // Create the cache dir if it doesn't exist.
                fp.mkdirs();
                fs.put("root", getEntry(Environment.getExternalStorageDirectory().getAbsolutePath() +
                        "/Android/data/" + cordova.getActivity().getPackageName() + "/cache/"));
            } else {
                fp = new File("/data/data/" + cordova.getActivity().getPackageName() + "/cache/");
                // Create the cache dir if it doesn't exist.
                fp.mkdirs();
                fs.put("root", getEntry("/data/data/" + cordova.getActivity().getPackageName() + "/cache/"));
            }
        }
        else if (type == PERSISTENT) {
            fs.put("name", "persistent");
            if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
                fs.put("root", getEntry(Environment.getExternalStorageDirectory()));
            } else {
                fs.put("root", getEntry("/data/data/" + cordova.getActivity().getPackageName()));
            }
        }
        else {
            throw new IOException("No filesystem of type requested");
        }

        return fs;
    }

    /**
     * Returns a JSON object representing the given File.
     *
     * @param file the File to convert
     * @return a JSON representation of the given File
     * @throws JSONException
     */
    public static JSONObject getEntry(File file) throws JSONException {
        JSONObject entry = new JSONObject();

        entry.put("isFile", file.isFile());
        entry.put("isDirectory", file.isDirectory());
        entry.put("name", file.getName());
        entry.put("fullPath", "file://" + file.getAbsolutePath());
        // The file system can't be specified, as it would lead to an infinite loop.
        // entry.put("filesystem", null);

        return entry;
    }

    /**
     * Returns a JSON Object representing a directory on the device's file system
     *
     * @param path to the directory
     * @return
     * @throws JSONException
     */
    private JSONObject getEntry(String path) throws JSONException {
        return getEntry(new File(path));
    }

    /**
     * Read the contents of a file.
     * This is done in a background thread; the result is sent to the callback.
     *
     * @param filename          The name of the file.
     * @param start             Start position in the file.
     * @param end               End position to stop at (exclusive).
     * @param callbackContext   The context through which to send the result.
     * @param encoding          The encoding to return contents as.  Typical value is UTF-8. (see http://www.iana.org/assignments/character-sets)
     * @param resultType        The desired type of data to send to the callback.
     * @return                  Contents of file.
     */
    public void readFileAs(final String filename, final int start, final int end, final CallbackContext callbackContext, final String encoding, final int resultType) {
        this.cordova.getThreadPool().execute(new Runnable() {
            @Override
			public void run() {
                try {
                    byte[] bytes = readAsBinaryHelper(filename, start, end);
                    
                    PluginResult result;
                    switch (resultType) {
                        case PluginResult.MESSAGE_TYPE_STRING:
                            result = new PluginResult(PluginResult.Status.OK, new String(bytes, encoding));
                            break;
                        case PluginResult.MESSAGE_TYPE_ARRAYBUFFER:
                            result = new PluginResult(PluginResult.Status.OK, bytes);
                            break;
                        case PluginResult.MESSAGE_TYPE_BINARYSTRING:
                            result = new PluginResult(PluginResult.Status.OK, bytes, true);
                            break;
                        default: // Base64.
                            String contentType = FileHelper.getMimeType(filename, cordova);
                            byte[] base64 = Base64.encode(bytes, Base64.NO_WRAP);
                            String s = "data:" + contentType + ";base64," + new String(base64, "US-ASCII");
                            result = new PluginResult(PluginResult.Status.OK, s);
                    }

                    callbackContext.sendPluginResult(result);
                } catch (FileNotFoundException e) {
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.IO_EXCEPTION, NOT_FOUND_ERR));
                } catch (IOException e) {
                    Log.d(LOG_TAG, e.getLocalizedMessage());
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.IO_EXCEPTION, NOT_READABLE_ERR));
                }
            }
        });
    }

    /**
     * Read the contents of a file as binary.
     * This is done synchronously; the result is returned.
     *
     * @param filename          The name of the file.
     * @param start             Start position in the file.
     * @param end               End position to stop at (exclusive).
     * @return                  Contents of the file as a byte[].
     * @throws IOException
     */
    private byte[] readAsBinaryHelper(String filename, int start, int end) throws IOException {
        int numBytesToRead = end - start;
        byte[] bytes = new byte[numBytesToRead];
        InputStream inputStream = FileHelper.getInputStreamFromUriString(filename, cordova);
        int numBytesRead = 0;

        if (start > 0) {
            inputStream.skip(start);
        }

        while (numBytesToRead > 0 && (numBytesRead = inputStream.read(bytes, numBytesRead, numBytesToRead)) >= 0) {
            numBytesToRead -= numBytesRead;
        }

        return bytes;
    }

    /**
     * Write contents of file.
     *
     * @param filename			The name of the file.
     * @param data				The contents of the file.
     * @param offset			The position to begin writing the file.
     * @param isBinary          True if the file contents are base64-encoded binary data
     * @throws FileNotFoundException, IOException
     * @throws NoModificationAllowedException
     */
    /**/
    public long write(String filename, String data, int offset, boolean isBinary) throws FileNotFoundException, IOException, NoModificationAllowedException {
        if (filename.startsWith("content://")) {
            throw new NoModificationAllowedException("Couldn't write to file given its content URI");
        }

        filename = FileHelper.getRealPath(filename, cordova);

        boolean append = false;
        if (offset > 0) {
            this.truncateFile(filename, offset);
            append = true;
        }

        byte[] rawData;
        if (isBinary) {
            rawData = Base64.decode(data, Base64.DEFAULT);
        } else {
            rawData = data.getBytes();
        }
        ByteArrayInputStream in = new ByteArrayInputStream(rawData);
        try
        {
            FileOutputStream out = new FileOutputStream(filename, append);
            byte buff[] = new byte[rawData.length];
            in.read(buff, 0, buff.length);
            out.write(buff, 0, rawData.length);
            out.flush();
            out.close();
        }
        catch (NullPointerException e)
        {
            // This is a bug in the Android implementation of the Java Stack
            NoModificationAllowedException realException = new NoModificationAllowedException(filename);
            throw realException;
        }

        return rawData.length;
    }

    /**
     * Truncate the file to size
     *
     * @param filename
     * @param size
     * @throws FileNotFoundException, IOException
     * @throws NoModificationAllowedException
     */
    private long truncateFile(String filename, long size) throws FileNotFoundException, IOException, NoModificationAllowedException {
        if (filename.startsWith("content://")) {
            throw new NoModificationAllowedException("Couldn't truncate file given its content URI");
        }

        filename = FileHelper.getRealPath(filename, cordova);

        RandomAccessFile raf = new RandomAccessFile(filename, "rw");
        try {
            if (raf.length() >= size) {
                FileChannel channel = raf.getChannel();
                channel.truncate(size);
                return size;
            }

            return raf.length();
        } finally {
            raf.close();
        }
    }
}
