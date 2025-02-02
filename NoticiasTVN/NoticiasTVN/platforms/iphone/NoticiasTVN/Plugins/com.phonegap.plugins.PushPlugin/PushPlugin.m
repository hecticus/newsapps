/*
 Copyright 2009-2011 Urban Airship Inc. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

 2. Redistributions in binaryform must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided withthe distribution.

 THIS SOFTWARE IS PROVIDED BY THE URBAN AIRSHIP INC``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 EVENT SHALL URBAN AIRSHIP INC OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#import "PushPlugin.h"

@implementation PushPlugin

@synthesize notificationMessage;
@synthesize isInline;

@synthesize callbackId;
@synthesize notificationCallbackId;
@synthesize callback;


- (void)unregister:(CDVInvokedUrlCommand*)command;
{
	self.callbackId = command.callbackId;

    [[UIApplication sharedApplication] unregisterForRemoteNotifications];
    [self successWithMessage:@"unregistered"];
}

- (void)register:(CDVInvokedUrlCommand*)command;
{
	self.callbackId = command.callbackId;

    NSMutableDictionary* options = [command.arguments objectAtIndex:0];

    UIRemoteNotificationType notificationTypes = UIRemoteNotificationTypeNone;
    id badgeArg = [options objectForKey:@"badge"];
    id soundArg = [options objectForKey:@"sound"];
    id alertArg = [options objectForKey:@"alert"];
    
    if ([badgeArg isKindOfClass:[NSString class]])
    {
        if ([badgeArg isEqualToString:@"true"])
            notificationTypes |= UIRemoteNotificationTypeBadge;
    }
    else if ([badgeArg boolValue])
        notificationTypes |= UIRemoteNotificationTypeBadge;
    
    if ([soundArg isKindOfClass:[NSString class]])
    {
        if ([soundArg isEqualToString:@"true"])
            notificationTypes |= UIRemoteNotificationTypeSound;
    }
    else if ([soundArg boolValue])
        notificationTypes |= UIRemoteNotificationTypeSound;
    
    if ([alertArg isKindOfClass:[NSString class]])
    {
        if ([alertArg isEqualToString:@"true"])
            notificationTypes |= UIRemoteNotificationTypeAlert;
    }
    else if ([alertArg boolValue])
        notificationTypes |= UIRemoteNotificationTypeAlert;
    
    self.callback = [options objectForKey:@"ecb"];

    if (notificationTypes == UIRemoteNotificationTypeNone)
        NSLog(@"PushPlugin.register: Push notification type is set to none");

    isInline = NO;

    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:notificationTypes];
	
	if (notificationMessage)			// if there is a pending startup notification
		[self notificationReceived];	// go ahead and process it
}

/*
- (void)isEnabled:(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options {
    UIRemoteNotificationType type = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
    NSString *jsStatement = [NSString stringWithFormat:@"navigator.PushPlugin.isEnabled = %d;", type != UIRemoteNotificationTypeNone];
    NSLog(@"JSStatement %@",jsStatement);
}
*/

- (void)didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {

    NSMutableDictionary *results = [NSMutableDictionary dictionary];
    NSString *token = [[[[deviceToken description] stringByReplacingOccurrencesOfString:@"<"withString:@""]
                        stringByReplacingOccurrencesOfString:@">" withString:@""]
                       stringByReplacingOccurrencesOfString: @" " withString: @""];
    [results setValue:token forKey:@"deviceToken"];
	
	//obtenemos el token viejo para comparar
	NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];  //load NSUserDefaults
	NSString *oldToken = [prefs objectForKey:@"regID"];
    
    #if !TARGET_IPHONE_SIMULATOR
        // Get Bundle Info for Remote Registration (handy if you have more than one app)
        [results setValue:[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"] forKey:@"appName"];
        [results setValue:[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"] forKey:@"appVersion"];
        
        // Check what Notifications the user has turned on.  We registered for all three, but they may have manually disabled some or all of them.
        NSUInteger rntypes = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];

        // Set the defaults to disabled unless we find otherwise...
        NSString *pushBadge = @"disabled";
        NSString *pushAlert = @"disabled";
        NSString *pushSound = @"disabled";

        // Check what Registered Types are turned on. This is a bit tricky since if two are enabled, and one is off, it will return a number 2... not telling you which
        // one is actually disabled. So we are literally checking to see if rnTypes matches what is turned on, instead of by number. The "tricky" part is that the
        // single notification types will only match if they are the ONLY one enabled.  Likewise, when we are checking for a pair of notifications, it will only be
        // true if those two notifications are on.  This is why the code is written this way
        if(rntypes & UIRemoteNotificationTypeBadge){
            pushBadge = @"enabled";
        }
        if(rntypes & UIRemoteNotificationTypeAlert) {
            pushAlert = @"enabled";
        }
        if(rntypes & UIRemoteNotificationTypeSound) {
            pushSound = @"enabled";
        }

        [results setValue:pushBadge forKey:@"pushBadge"];
        [results setValue:pushAlert forKey:@"pushAlert"];
        [results setValue:pushSound forKey:@"pushSound"];

        // Get the users Device Model, Display Name, Token & Version Number
        UIDevice *dev = [UIDevice currentDevice];
        [results setValue:dev.name forKey:@"deviceName"];
        [results setValue:dev.model forKey:@"deviceModel"];
        [results setValue:dev.systemVersion forKey:@"deviceSystemVersion"];
	
		//NSLog(@"%@",token);
		//PUSH REGISTRATION ON SERVER
		// Prepare the Device Token for Registration (remove spaces and < >)
		NSString *deviceTokenClean = [[[[deviceToken description]
									stringByReplacingOccurrencesOfString:@"<"withString:@""]
								   stringByReplacingOccurrencesOfString:@">" withString:@""]
								  stringByReplacingOccurrencesOfString: @" " withString: @""];
	
		NSString *host = @"kraken.hecticus.com";
		//NSString *host = @"10.0.3.142/kraken";
		//NSString *host = @"10.0.3.148/kraken";
		NSString *urlString = @"";
		if(oldToken != nil && ![oldToken isEqualToString:@""]){
			urlString = [NSString stringWithFormat:@"/storefront/wsext/mobile_push/noticiastvn/activatePushClient.php?ext_id=%@&old_ext_id=%@&id_business=%@&service_type=%@&id_country=%@&command=%@&origin=%@&token=%@", deviceTokenClean, oldToken, @"16", @"ios", @"8", @"ALTA", @"IOS", @"NOTICIASTVN"];
		}else{
			urlString = [NSString stringWithFormat:@"/storefront/wsext/mobile_push/noticiastvn/activatePushClient.php?ext_id=%@&id_business=%@&service_type=%@&id_country=%@&command=%@&origin=%@&token=%@", deviceTokenClean, @"16", @"ios", @"8", @"ALTA", @"IOS", @"NOTICIASTVN"];
		}
	
		//NSLog(@"Debug data URL to send: %@", urlString);
		if(oldToken==nil || ![oldToken isEqualToString:token]){
			@try{
				// Register the Device Data
				// !!! CHANGE "http" TO "https" IF YOU ARE USING HTTPS PROTOCOL
				NSURL *url = [[NSURL alloc] initWithScheme:@"http" host:host path:[urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
				NSURLRequest *request = [[NSURLRequest alloc] initWithURL:url];
				NSData *returnData = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:nil];
				NSString *str = [[NSString alloc] initWithData:returnData encoding:NSUTF8StringEncoding];
				
				NSDictionary *JSON =
				[NSJSONSerialization JSONObjectWithData: [str dataUsingEncoding:NSUTF8StringEncoding]
												options: NSJSONReadingMutableContainers
												  error: nil];

				NSInteger error = [[JSON objectForKey:@"error"] integerValue];
				if(error == 0){
					//NSLog(@"TODO OK LLAMANDO WS");
					//si todo salio bien guardamos el nuevo REGID
					[prefs setObject:token forKey:@"regID"];
				}else{
					//NSLog(@"ERROR LLAMANDO WS");
				}
		
			}@catch (NSException * e){
				NSLog(@"Exception: %@", e);
			}
		}else{
			//NSLog(@"NO HAY QUE LLAMAR WS");
		}


		[self successWithMessage:[NSString stringWithFormat:@"%@", token]];
    #endif
}

- (void)didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
	[self failWithMessage:@"" withError:error];
}

- (void)notificationReceived {
    NSLog(@"Notification received");

    if (notificationMessage && self.callback)
    {
        NSMutableString *jsonStr = [NSMutableString stringWithString:@"{"];

        [self parseDictionary:notificationMessage intoJSON:jsonStr];

        if (isInline)
        {
            [jsonStr appendFormat:@"foreground:\"%d\"", 1];
            isInline = NO;
        }
		else
            [jsonStr appendFormat:@"foreground:\"%d\"", 0];
        
        [jsonStr appendString:@"}"];

        //NSLog(@"Msg: %@", jsonStr);

        NSString * jsCallBack = [NSString stringWithFormat:@"%@(%@);", self.callback, jsonStr];
        [self.webView stringByEvaluatingJavaScriptFromString:jsCallBack];
        
        self.notificationMessage = nil;
    }
}

// reentrant method to drill down and surface all sub-dictionaries' key/value pairs into the top level json
-(void)parseDictionary:(NSDictionary *)inDictionary intoJSON:(NSMutableString *)jsonString
{
    NSArray         *keys = [inDictionary allKeys];
    NSString        *key;
    
    for (key in keys)
    {
        id thisObject = [inDictionary objectForKey:key];
    
        if ([thisObject isKindOfClass:[NSDictionary class]])
            [self parseDictionary:thisObject intoJSON:jsonString];
        else if ([thisObject isKindOfClass:[NSString class]])
             [jsonString appendFormat:@"\"%@\":\"%@\",",
              key,
              [[[[inDictionary objectForKey:key]
                stringByReplacingOccurrencesOfString:@"\\" withString:@"\\\\"]
                 stringByReplacingOccurrencesOfString:@"\"" withString:@"\\\""]
                 stringByReplacingOccurrencesOfString:@"\n" withString:@"\\n"]];
        else {
            [jsonString appendFormat:@"\"%@\":\"%@\",", key, [inDictionary objectForKey:key]];
        }
    }
}

- (void)setApplicationIconBadgeNumber:(CDVInvokedUrlCommand *)command {

    self.callbackId = command.callbackId;

    NSMutableDictionary* options = [command.arguments objectAtIndex:0];
    int badge = [[options objectForKey:@"badge"] intValue] ?: 0;

    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:badge];

    [self successWithMessage:[NSString stringWithFormat:@"app badge count set to %d", badge]];
}
-(void)successWithMessage:(NSString *)message
{
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:message];
    
    [self.commandDelegate sendPluginResult:commandResult callbackId:self.callbackId];
}

-(void)failWithMessage:(NSString *)message withError:(NSError *)error
{
    NSString        *errorMessage = (error) ? [NSString stringWithFormat:@"%@ - %@", message, [error localizedDescription]] : message;
    CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorMessage];
    
    [self.commandDelegate sendPluginResult:commandResult callbackId:self.callbackId];
}

@end
