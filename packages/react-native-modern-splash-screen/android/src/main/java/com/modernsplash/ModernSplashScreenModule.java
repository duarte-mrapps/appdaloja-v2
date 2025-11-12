package com.modernsplash;

import android.app.Activity;
import android.view.View;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ModernSplashScreenModule extends ReactContextBaseJavaModule {
  public ModernSplashScreenModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "ModernSplashScreen";
  }

  @ReactMethod
  public void hide() {
    Activity activity = getCurrentActivity();
    if (activity == null) return;
    activity.runOnUiThread(() -> {
      View splashView = activity.findViewById(android.R.id.content);
      if (splashView != null) splashView.animate().alpha(0f).setDuration(250).withEndAction(() -> {
        splashView.setVisibility(View.GONE);
      }).start();
    });
  }

  @ReactMethod
  public void show() {
    Activity activity = getCurrentActivity();
    if (activity == null) return;
    activity.runOnUiThread(() -> {
      View splashView = activity.findViewById(android.R.id.content);
      if (splashView != null) {
        splashView.setVisibility(View.VISIBLE);
        splashView.setAlpha(1f);
      }
    });
  }
}
