#import <Cordova/CDV.h>

@interface SMSPlugin : CDVPlugin

@property (retain) UIDocumentInteractionController * documentInteractionController;

- (void)available:(CDVInvokedUrlCommand*)command;
- (void)sendSMS:(CDVInvokedUrlCommand*)command;

@end