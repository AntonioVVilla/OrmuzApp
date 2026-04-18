# Project-specific ProGuard / R8 rules.
# Applied on top of the default Android rules and react-native's own
# consumer rules from node_modules/react-native/ReactAndroid.

# --- MapLibre ---
# MapLibre uses reflection to look up native style/layer classes at
# runtime; unconditionally keep everything in its package.
-keep class org.maplibre.** { *; }
-keep interface org.maplibre.** { *; }
-dontwarn org.maplibre.**

# --- React Native Geolocation Service ---
-keep class com.agontuk.RNFusedLocation.** { *; }
-dontwarn com.agontuk.RNFusedLocation.**

# --- React Native Gesture Handler ---
-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.gesturehandler.**

# --- Reanimated / Worklets ---
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-dontwarn com.swmansion.reanimated.**

# --- OkHttp / Retrofit transitive noise (via RN fetch) ---
-dontwarn javax.annotation.**
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn okio.**

# --- AndroidX / Kotlin noise we don't care about for a shipped APK ---
-dontwarn kotlinx.coroutines.flow.**

# Preserve line numbers in stack traces to make production crash
# reports actionable while still obfuscating class/method names.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
