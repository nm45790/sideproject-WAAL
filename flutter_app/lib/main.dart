// ============================================
// 패키지 import
// ============================================
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

// Firebase 관련 패키지
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'firebase_options.dart';

// ============================================
// 백그라운드 푸시 알림 핸들러
// 앱이 백그라운드/종료 상태일 때 푸시 알림 수신 시 실행됨
// ============================================
@pragma('vm:entry-point') // 앱이 종료되어도 이 함수는 실행되도록 보장
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // 백그라운드에서도 Firebase 초기화 필요
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  print('📩 백그라운드 메시지 수신: ${message.notification?.title}');
}

// 앱 시작점 (main 함수)
// ============================================
void main() async {
  // Flutter 엔진과 위젯 바인딩 초기화 (비동기 작업 전에 필수!)
  WidgetsFlutterBinding.ensureInitialized();

  // --------------------------------------------
  // Firebase 초기화
  // --------------------------------------------
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  // --------------------------------------------
  // 백그라운드 메시지 핸들러 등록
  // --------------------------------------------
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // --------------------------------------------
  // 푸시 알림 권한 요청 (iOS는 필수, Android 13+도 필요)
  // --------------------------------------------
  NotificationSettings settings = await FirebaseMessaging.instance
      .requestPermission(
        alert: true, // 알림 표시
        badge: true, // 앱 아이콘 뱃지
        sound: true, // 알림 소리
      );
  print('🔔 푸시 알림 권한 상태: ${settings.authorizationStatus}');

  // --------------------------------------------
  // FCM 토큰 가져오기 (서버에 저장해서 푸시 보낼 때 사용)
  // --------------------------------------------
  String? token = await FirebaseMessaging.instance.getToken();
  print('🔑 FCM 토큰: $token');

  // 토큰 갱신 리스너 (토큰이 변경되면 서버에 업데이트 필요)
  FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
    print('🔄 FCM 토큰 갱신됨: $newToken');
    // TODO: 서버에 새 토큰 전송하는 로직 추가
  });

  // --------------------------------------------
  // 포그라운드 푸시 알림 수신 리스너
  // 앱이 열려있을 때 푸시 알림 수신 시 실행됨
  // --------------------------------------------
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    print('📬 포그라운드 메시지 수신!');
    print('   제목: ${message.notification?.title}');
    print('   내용: ${message.notification?.body}');

    // TODO: 인앱 알림 표시 로직 추가 (예: SnackBar, Dialog 등)
  });

  // --------------------------------------------
  // 푸시 알림 클릭 시 실행되는 리스너
  // 백그라운드 상태에서 알림 클릭 시
  // --------------------------------------------
  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    print('👆 푸시 알림 클릭됨!');
    print('   데이터: ${message.data}');

    // TODO: 특정 화면으로 이동하는 로직 추가
  });

  // --------------------------------------------
  // 화면 방향 설정 (세로 모드 고정)
  // --------------------------------------------
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // 앱 실행
  runApp(const WaalApp());
}

// ============================================
// 앱 루트 위젯
// ============================================
class WaalApp extends StatelessWidget {
  const WaalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WAAL',
      debugShowCheckedModeBanner: false, // 디버그 배너 숨김
      theme: ThemeData(primarySwatch: Colors.blue, useMaterial3: true),
      home: const WebViewScreen(),
    );
  }
}

// ============================================
// WebView 화면 위젯
// ============================================
class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  // WebView 컨트롤러
  late final WebViewController controller;

  // 로딩 상태 관리
  bool isLoading = true;
  double loadingProgress = 0;

  // 웹앱 URL
  static const String webAppUrl = 'https://waal.vercel.app/';

  @override
  void initState() {
    super.initState();

    // WebView 컨트롤러 초기화
    controller = WebViewController()
      // JavaScript 활성화 (웹앱 동작에 필수)
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      // 배경색 설정
      ..setBackgroundColor(Colors.white)
      // 네비게이션 이벤트 핸들러
      ..setNavigationDelegate(
        NavigationDelegate(
          // 페이지 로딩 시작
          onPageStarted: (String url) {
            setState(() {
              isLoading = true;
            });
          },
          // 로딩 진행률 업데이트
          onProgress: (int progress) {
            setState(() {
              loadingProgress = progress / 100;
            });
          },
          // 페이지 로딩 완료
          onPageFinished: (String url) {
            setState(() {
              isLoading = false;
            });
          },
          // 에러 발생 시
          onWebResourceError: (WebResourceError error) {
            debugPrint('WebView 에러: ${error.description}');
          },
        ),
      )
      // URL 로드
      ..loadRequest(Uri.parse(webAppUrl));
  }

  @override
  Widget build(BuildContext context) {
    // 뒤로가기 버튼 처리
    return PopScope(
      canPop: false, // 기본 뒤로가기 동작 막음
      onPopInvokedWithResult: (bool didPop, dynamic result) async {
        if (didPop) return;

        // WebView 내에서 뒤로갈 수 있으면 뒤로가기
        final canGoBack = await controller.canGoBack();
        if (canGoBack) {
          await controller.goBack();
        }
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          child: Stack(
            children: [
              // WebView 위젯
              WebViewWidget(controller: controller),

              // 로딩 중일 때 프로그레스 바 표시
              if (isLoading)
                LinearProgressIndicator(
                  value: loadingProgress,
                  backgroundColor: Colors.grey[200],
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
