# Firebase 푸시 알림 설정 가이드

바이브 코딩으로 한 것이므로 도움이 안 되실 수도 있어요.

---

## Step 1: Firebase CLI 설치

**왜?** Firebase 프로젝트를 터미널에서 관리하기 위해 설치합니다.

```bash
curl -sL https://firebase.tools | bash
firebase login
```

**로그인 시 질문:**
- `Enable Gemini in Firebase features?` → AI 기능 활성화 여부 → **Y 추천**
- `Allow Firebase to collect...?` → 통계 수집 동의 → **아무거나 OK**
- 브라우저에서 Google 로그인 → 완료!

---

## Step 2: FlutterFire CLI 설치

**왜?** Flutter 프로젝트에 Firebase를 자동 연동하는 도구입니다. 수동 설정보다 훨씬 편합니다.

```bash
dart pub global activate flutterfire_cli
export PATH="$PATH":"$HOME/.pub-cache/bin"
```

**이슈:** `command not found: flutterfire` 오류 시
→ PATH 추가 후 터미널 재시작하거나 `~/.pub-cache/bin/flutterfire`로 실행

---

## Step 3: Firebase 프로젝트 연동

**왜?** iOS/Android 앱에 Firebase 설정 파일을 자동 생성합니다.

```bash
cd flutter_app
flutterfire configure
```

**이슈:** `firebase_options.dart`가 비어있다면?
→ `flutterfire configure` 다시 실행하거나 수동 생성

**이슈:** `xcodeproj` 오류 시
→ `sudo gem install xcodeproj` 실행

---

## Step 4: Flutter 패키지 추가

**왜?** Firebase와 푸시 알림 기능을 Flutter에서 사용하기 위한 패키지입니다.

```bash
flutter pub add firebase_core
flutter pub add firebase_messaging
```

**이슈:** `Expected to find project root` 오류 시
→ `flutter_app` 폴더 안에서 실행했는지 확인!

---

## Step 5: main.dart 수정

**왜?** Firebase 초기화, 푸시 권한 요청, 메시지 수신 로직을 추가합니다.

```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'firebase_options.dart';

// 백그라운드 메시지 핸들러
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  print('백그라운드 메시지: ${message.messageId}');
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Firebase 초기화
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // 백그라운드 핸들러 등록
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // 푸시 알림 권한 요청
  await FirebaseMessaging.instance.requestPermission(
    alert: true,
    badge: true,
    sound: true,
  );

  // FCM 토큰 출력 (서버에 저장할 때 필요)
  String? token = await FirebaseMessaging.instance.getToken();
  print('FCM Token: $token');

  runApp(const MyApp());
}
```

---

## Step 6: iOS 추가 설정

**왜?** iOS는 별도의 푸시 알림 설정이 필요합니다.

### 6-1. Podfile 수정

```ruby
# ios/Podfile 상단에 추가 (주석 해제)
platform :ios, '15.0'
```

**이슈:** `higher minimum deployment target` 오류 시
→ iOS 버전을 `15.0` 이상으로 올려야 Firebase 호환됨

### 6-2. AppDelegate.swift 수정

```swift
import Flutter
import UIKit
import FirebaseCore
import FirebaseMessaging

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // Firebase 초기화
    FirebaseApp.configure()

    // 푸시 알림 등록
    UNUserNotificationCenter.current().delegate = self
    application.registerForRemoteNotifications()

    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

### 6-3. Pod 설치

```bash
cd ios && pod install
```

---

## Step 7: Android 추가 설정

**왜?** Android 13부터 푸시 알림 권한이 별도로 필요합니다.

**android/app/src/main/AndroidManifest.xml에 추가:**

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

---

## Step 8: 빌드 & 테스트

```bash
# Android
flutter build apk --debug

# iOS
flutter build ios --debug --no-codesign
```

---

## Step 9: 푸시 알림 테스트

### 9-1. FCM 토큰 확인

앱 실행 시 콘솔에 출력됩니다:

```bash
flutter run
```

콘솔에서 이런 로그 확인:

```
🔔 푸시 알림 권한 상태: AuthorizationStatus.authorized
🔑 FCM 토큰: fLeJA0FcTSuW17RBPuKNHb:APA91bEy8pCl...긴토큰...
```

### 9-2. Firebase Console에서 테스트 메시지 전송

1. https://console.firebase.google.com 접속
2. 프로젝트 선택 (예: waal-app)
3. 왼쪽 메뉴에서 **참여** → **Messaging** 클릭
4. **첫 번째 캠페인 만들기** 클릭
5. **Firebase 알림 메시지** 선택 → **만들기**
6. 알림 제목/텍스트 입력 (예: "테스트 알림", "푸시 알림 테스트입니다!")
7. **테스트 메시지 전송** 클릭
8. **FCM 등록 토큰 추가** → 콘솔에서 복사한 토큰 붙여넣기
9. **테스트** 클릭!

### 9-3. 결과 확인

**앱이 포그라운드(열려있는 상태)일 때:**
- 알림창 안 뜸
- 콘솔에 로그 출력:
```
📬 포그라운드 메시지 수신!
   제목: 테스트 알림
   내용: 푸시 알림 테스트입니다!
```

**앱이 백그라운드(최소화/꺼진 상태)일 때:**
- 알림창에 푸시 알림 표시됨
- 알림 클릭 시 앱 열림

---

## 참고

- FCM 토큰은 기기마다 고유합니다 (기기의 주소 같은 개념)
- **iOS 시뮬레이터**에서는 푸시 알림이 오지 않습니다 (Apple 제한)
- **Android 에뮬레이터**에서는 푸시 알림 테스트 가능합니다
- 실제 서비스에서는 FCM 토큰을 서버에 저장하고, 서버에서 푸시를 보냅니다
- iOS 실기기 테스트는 Apple Developer 계정 + APNs 인증서 필요
