#import "ModernSplashScreen.h"
#import <UIKit/UIKit.h>

@implementation ModernSplashScreen

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(hide)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *rootView = [UIApplication sharedApplication].delegate.window.rootViewController.view;
    [UIView animateWithDuration:0.25 animations:^{
      rootView.alpha = 0.0;
    } completion:^(BOOL finished) {
      rootView.hidden = YES;
    }];
  });
}

RCT_EXPORT_METHOD(show)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *rootView = [UIApplication sharedApplication].delegate.window.rootViewController.view;
    rootView.hidden = NO;
    rootView.alpha = 1.0;
  });
}

@end
