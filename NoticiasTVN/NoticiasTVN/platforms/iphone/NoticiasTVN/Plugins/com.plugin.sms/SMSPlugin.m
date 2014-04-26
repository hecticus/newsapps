#import "SMSPlugin.h"
#import <Cordova/CDV.h>
#import <Foundation/NSException.h>

@implementation SMSPlugin

- (void)available:(CDVInvokedUrlCommand*)command {
    NSString *callbackId = command.callbackId;

    BOOL avail = false;
    if (NSClassFromString(@"UIActivityViewController")) {
      avail = true;
    }

    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:avail];
    [self writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
}

- (void)sendSMS:(CDVInvokedUrlCommand*)command {

    /*if (!NSClassFromString(@"UIActivityViewController")) {
      CDVPluginResult * pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"not available"];
      [self writeJavascript:[pluginResult toErrorCallbackString:command.callbackId]];
      return;
    }

    NSString *message   = [command.arguments objectAtIndex:0];
    NSString *subject   = [command.arguments objectAtIndex:1];
    NSString *imageName = [command.arguments objectAtIndex:2];
    NSString *urlString = [command.arguments objectAtIndex:3];

    // handle URL
    NSURL *url = nil;
    if (urlString != (id)[NSNull null]) {
      url = [NSURL URLWithString:urlString];
    }

    // handle image
    UIImage *image = [self getImage:imageName];

    // Facebook gets really confused when passing a nil image or url
    NSArray *activityItems;
    if (image != nil) {
      if (url == nil) {
        activityItems = [[NSArray alloc] initWithObjects:message, image, nil];
      } else {
        activityItems = [[NSArray alloc] initWithObjects:message, image, url, nil];
      }
    } else if (url != nil) {
      activityItems = [[NSArray alloc] initWithObjects:message, url, nil];
    } else {
      activityItems = [[NSArray alloc] initWithObjects:message, nil];
    }

    UIActivity *activity = [[UIActivity alloc] init];
    NSArray *applicationActivities = [[NSArray alloc] initWithObjects:activity, nil];
    UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:activityItems applicationActivities:applicationActivities];
    if (subject != (id)[NSNull null]) {
      [activityVC setValue:subject forKey:@"subject"];
    }

    [self.viewController presentViewController:activityVC animated:YES completion:nil];
    CDVPluginResult * pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self writeJavascript:[pluginResult toSuccessCallbackString:command.callbackId]];*/
}


@end