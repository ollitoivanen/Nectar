package com.nectar; // replace com.your-app-name with your app’s name
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.Connector;
import com.spotify.android.appremote.api.SpotifyAppRemote;
import com.facebook.react.bridge.ActivityEventListener;


import com.spotify.protocol.client.Subscription;
import com.spotify.protocol.types.PlaybackPosition;
import com.spotify.protocol.types.PlayerState;
import com.spotify.protocol.types.Track;
import com.spotify.sdk.android.authentication.AuthenticationClient;
import com.spotify.sdk.android.authentication.AuthenticationRequest;
import com.spotify.sdk.android.authentication.AuthenticationResponse;


import static com.spotify.protocol.types.Repeat.ALL;
import static com.spotify.sdk.android.authentication.AuthenticationResponse.Type.TOKEN;
import static com.spotify.sdk.android.authentication.AuthenticationResponse.Type.ERROR;
import com.facebook.react.bridge.Callback;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.Timer;
import java.util.TimerTask;


public class SpotifyModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int REQUEST_CODE = 1337;
    private static final String CLIENT_ID = "da5f89a896fd4380a59db2ec52e64d93";
    private static final String REDIRECT_URI = "nectar://callback";
    private Promise authPromise;

    private SpotifyAppRemote mSpotifyAppRemote;

    SpotifyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "SpotifyModule";
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void subscribeToAppRemote(){
        ConnectionParams connectionParams =
                new ConnectionParams.Builder(CLIENT_ID)
                        .setRedirectUri(REDIRECT_URI)
                        .showAuthView(false)
                        .build();

        SpotifyAppRemote.connect(getReactApplicationContext(), connectionParams,
                new Connector.ConnectionListener() {

                    public void onConnected(SpotifyAppRemote spotifyAppRemote) {
                        mSpotifyAppRemote = spotifyAppRemote;
                        mSpotifyAppRemote.getPlayerApi()
                                .subscribeToPlayerState()
                                .setEventCallback(playerState -> {
                                    WritableMap params = Arguments.createMap();
                                    final Track track = playerState.track;
                                    params.putBoolean("isPaused", playerState.isPaused);
                                    params.putString("trackName", track.name);

                                    params.putString("trackUri", track.uri);
                                    params.putInt("playbackPosition", (int)playerState.playbackPosition);
                                    sendEvent(getReactApplicationContext(), "playerState", params);
                                });


                        // Now you can start interacting with App Remote

                    }

                    public void onFailure(Throwable throwable) {
                        // Something went wrong when attempting to connect! Handle errors here
                    }
                });

    }

    @ReactMethod
    public void getTrackProgression(Callback callback){
        mSpotifyAppRemote.getPlayerApi().getPlayerState().setResultCallback(playerState -> {
            try {
                WritableMap resultData = new WritableNativeMap();

                long playbackPosition = playerState.playbackPosition;
                int playbackPositionInt = (int)playbackPosition;
                resultData.putInt("playbackPosition",(playbackPositionInt));
                callback.invoke(resultData);
            } catch(Exception e) {
            }     });


    }

    @ReactMethod
    public void authenticate(Promise promise){
        authPromise = promise;

        AuthenticationRequest.Builder builder =
                new AuthenticationRequest.Builder(CLIENT_ID, TOKEN, REDIRECT_URI);

        builder.setScopes(new String[]{"streaming, user-top-read, user-modify-playback-state"});
        AuthenticationRequest request = builder.build();

        AuthenticationClient.openLoginActivity(getCurrentActivity(), REQUEST_CODE, request);
    }



    @ReactMethod
    public void playSong(String songId) {
        mSpotifyAppRemote.getPlayerApi().play(songId).setResultCallback(callback-> {
        });

    }

    @ReactMethod
    public void chooseSong(String songId){
        //Doenst work, pauses after a while
        mSpotifyAppRemote.getPlayerApi().play(songId).setResultCallback(callback-> {
            Timer timer = new Timer();

            timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    mSpotifyAppRemote.getPlayerApi().pause();



                }
            }, 10);
            //mSpotifyAppRemote.getPlayerApi().setRepeat(ALL);
        });


    }

    @ReactMethod
    public void disconnect(){
        SpotifyAppRemote.disconnect(mSpotifyAppRemote);

    }

    @ReactMethod
    public void pause(){
        mSpotifyAppRemote.getPlayerApi().pause();
    }

    @ReactMethod
    public void resume(){
        mSpotifyAppRemote.getPlayerApi().resume();
    }

    @ReactMethod
    public void playSongFromPosition(String songId, Integer position){

        mSpotifyAppRemote.getPlayerApi().play(songId).setResultCallback(callback->{
        mSpotifyAppRemote.getPlayerApi().setRepeat(ALL);
        mSpotifyAppRemote.getPlayerApi().pause();
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                mSpotifyAppRemote.getPlayerApi().seekTo(position).setResultCallback(callis->{
                    mSpotifyAppRemote.getPlayerApi().resume();

                });
            }
        }, 200);
    });
    // Now you can start interacting with App Remote
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

        if (requestCode == REQUEST_CODE) {
            AuthenticationResponse response = AuthenticationClient.getResponse(resultCode, data);

            switch (response.getType()) {
                // Response was successful and contains auth token
                case TOKEN:
                        String token = response.getAccessToken();
                        Log.d("MyApplication", "login success:" + token);
                        authPromise.resolve(token);


                    break;

                // Auth flow returned an error
                case ERROR:
                        String code = response.getCode();
                        String error = response.getError();
                        Log.d("MyApplication", "login error:" + code);


                    break;

                // Most likely auth flow was cancelled
                default:

            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
    }






}