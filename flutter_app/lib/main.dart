// ============================================
// 패키지 import
// ============================================
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

// Firebase 관련 패키지
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'firebase_options.dart';

// 스플래시 화면
import 'screens/splash_screen.dart';

// ============================================
// 백그라운드 푸시 알림 핸들러
// 앱이 백그라운드/종료 상태일 때 푸시 알림 수신 시 실행됨
// ============================================
@pragma('vm:entry-point') // 앱이 종료되어도 이 함수는 실행되도록 보장
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // 백그라운드에서도 Firebase 초기화 필요 (이미 초기화되어 있으면 스킵)
  try {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  } catch (e) {
    // 이미 초기화된 경우 무시
  }
  print('📩 백그라운드 메시지 수신: ${message.notification?.title}');
}

// 앱 시작점 (main 함수)
// ============================================
void main() async {
  // Flutter 엔진과 위젯 바인딩 초기화 (비동기 작업 전에 필수!)
  WidgetsFlutterBinding.ensureInitialized();

  // --------------------------------------------
  // Firebase 초기화 (이미 초기화되어 있으면 스킵)
  // --------------------------------------------
  try {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  } catch (e) {
    // 이미 초기화된 경우 무시
    debugPrint('Firebase already initialized: $e');
  }

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
  // 시뮬레이터에서는 APNS 토큰이 없어서 에러 발생 가능
  // --------------------------------------------
  try {
    String? token = await FirebaseMessaging.instance.getToken();
    print('🔑 FCM 토큰: $token');
  } catch (e) {
    debugPrint('FCM 토큰 가져오기 실패 (시뮬레이터에서는 정상): $e');
  }

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
class WaalApp extends StatefulWidget {
  const WaalApp({super.key});

  @override
  State<WaalApp> createState() => _WaalAppState();
}

class _WaalAppState extends State<WaalApp> {
  // 스플래시 완료 여부
  bool _splashComplete = false;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WAAL',
      debugShowCheckedModeBanner: false, // 디버그 배너 숨김
      theme: ThemeData(primarySwatch: Colors.blue, useMaterial3: true),
      home: _splashComplete
          ? const WebViewScreen()
          : SplashScreen(
              onComplete: () {
                setState(() {
                  _splashComplete = true;
                });
              },
            ),
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

  // --------------------------------------------
  // 전화 걸기 (네이티브 전화 앱 실행)
  // --------------------------------------------
  // ⚠️ 참고: iOS 시뮬레이터에서는 전화 앱이 없어서 canLaunchUrl이 false 반환
  // 실제 iPhone 기기에서는 정상 작동함
  // Android 에뮬레이터는 전화 앱이 있어서 테스트 가능
  // --------------------------------------------
  Future<void> _launchPhone(String url) async {
    final uri = Uri.parse(url);
    debugPrint('📞 전화 걸기: $url');

    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      // iOS 시뮬레이터: 전화 앱 미설치로 인해 실행 불가
      // 실제 기기에서는 이 분기로 들어오지 않음
      debugPrint('❌ 전화 앱을 실행할 수 없습니다: $url (시뮬레이터에서는 정상)');
    }
  }

  // --------------------------------------------
  // 일반 URL 실행 (mailto: 등)
  // --------------------------------------------
  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    debugPrint('🔗 URL 실행: $url');

    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      debugPrint('❌ URL을 실행할 수 없습니다: $url');
    }
  }

  // --------------------------------------------
  // tel:, mailto: 링크 가로채기 JavaScript 주입
  // window.location.href = 'tel:...' 를 Flutter로 전달
  // --------------------------------------------
  void _injectTelInterceptor() {
    const script = '''
      (function() {
        // 이미 주입되었는지 확인
        if (window._flutterTelInterceptorInjected) return;
        window._flutterTelInterceptorInjected = true;

        // window.location.href setter 오버라이드
        var originalLocationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');

        // location.href 변경 감지를 위한 프록시
        var locationProxy = new Proxy(window.location, {
          set: function(target, prop, value) {
            if (prop === 'href') {
              if (typeof value === 'string' && (value.startsWith('tel:') || value.startsWith('mailto:'))) {
                // Flutter로 전달
                if (window.FlutterBridge) {
                  window.FlutterBridge.postMessage(value);
                  return true;
                }
              }
            }
            target[prop] = value;
            return true;
          },
          get: function(target, prop) {
            var value = target[prop];
            if (typeof value === 'function') {
              return value.bind(target);
            }
            return value;
          }
        });

        // 전역 함수로 tel 링크 처리
        window.handleTelLink = function(phoneNumber) {
          if (window.FlutterBridge) {
            window.FlutterBridge.postMessage('tel:' + phoneNumber.replace(/-/g, ''));
          }
        };

        console.log('📱 Flutter tel: interceptor injected');
      })();
    ''';

    controller.runJavaScript(script);
    debugPrint('📱 tel: 인터셉터 JavaScript 주입 완료');
  }

  @override
  void initState() {
    super.initState();

    // WebView 컨트롤러 초기화
    controller = WebViewController()
      // JavaScript 활성화 (웹앱 동작에 필수)
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      // 배경색 설정
      ..setBackgroundColor(Colors.white)
      // JavaScript Alert 다이얼로그 처리
      ..setOnJavaScriptAlertDialog((request) async {
        await showDialog(
          context: context,
          builder: (context) => AlertDialog(
            content: Text(request.message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('확인'),
              ),
            ],
          ),
        );
      })
      // JavaScript Confirm 다이얼로그 처리
      ..setOnJavaScriptConfirmDialog((request) async {
        final result = await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            content: Text(request.message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('취소'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('확인'),
              ),
            ],
          ),
        );
        return result ?? false;
      })
      // JavaScript Channel 등록 (웹 -> Flutter 통신)
      ..addJavaScriptChannel(
        'FlutterBridge',
        onMessageReceived: (JavaScriptMessage message) {
          final data = message.message;
          debugPrint('📱 FlutterBridge 메시지 수신: $data');

          // tel: 스킴 처리
          if (data.startsWith('tel:')) {
            _launchPhone(data);
          }
          // mailto: 스킴 처리
          else if (data.startsWith('mailto:')) {
            _launchUrl(data);
          }
        },
      )
      // 네비게이션 이벤트 핸들러
      ..setNavigationDelegate(
        NavigationDelegate(
          // 네비게이션 요청 처리 (tel:, mailto: 등 외부 URL 처리)
          onNavigationRequest: (NavigationRequest request) {
            final url = request.url;

            // tel: 스킴 처리 (전화 걸기)
            if (url.startsWith('tel:')) {
              _launchPhone(url);
              return NavigationDecision.prevent;
            }

            // mailto: 스킴 처리 (이메일 보내기)
            if (url.startsWith('mailto:')) {
              _launchUrl(url);
              return NavigationDecision.prevent;
            }

            // 일반 URL은 WebView에서 처리
            return NavigationDecision.navigate;
          },
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
          // 페이지 로딩 완료 -> JavaScript 주입
          onPageFinished: (String url) {
            setState(() {
              isLoading = false;
            });
            // tel:, mailto: 링크 가로채기 JavaScript 주입
            _injectTelInterceptor();
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
