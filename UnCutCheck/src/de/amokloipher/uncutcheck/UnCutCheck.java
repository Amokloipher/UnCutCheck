package de.amokloipher.uncutcheck;

import org.apache.cordova.DroidGap;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.Menu;

public class UnCutCheck extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        super.loadUrl("file:///android_asset/www/html/index.html");
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_uncut_check, menu);
        return true;
    }
}
