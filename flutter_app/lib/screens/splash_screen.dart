import 'package:flutter/material.dart';

/// 앱 시작 시 표시되는 스플래시 화면
/// 웹 버전(app/components/Splash.tsx)과 동일한 디자인
class SplashScreen extends StatefulWidget {
  final VoidCallback onComplete;

  const SplashScreen({super.key, required this.onComplete});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  // 애니메이션 컨트롤러
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<Offset> _slideAnimation;

  // WAAL 브랜드 컬러 (웹과 동일: #3f55ff)
  static const Color brandColor = Color(0xFF3F55FF);

  @override
  void initState() {
    super.initState();
    print('🎬 SplashScreen initState 호출됨');

    // 애니메이션 컨트롤러 설정 (1초 duration)
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    // 페이드인 애니메이션 (opacity 0 -> 1)
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    // 스케일 애니메이션 (0.95 -> 1.0)
    _scaleAnimation = Tween<double>(begin: 0.95, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    // 슬라이드 애니메이션 (아래에서 위로)
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.1),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));

    // 100ms 후 애니메이션 시작 (웹과 동일)
    Future.delayed(const Duration(milliseconds: 100), () {
      if (mounted) {
        _controller.forward();
      }
    });

    // 스플래시 완료 후 WebView로 전환 (총 2.5초)
    Future.delayed(const Duration(milliseconds: 2500), () {
      if (mounted) {
        widget.onComplete();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    print('🎨 SplashScreen build 호출됨');
    return Scaffold(
      backgroundColor: brandColor,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: SlideTransition(
              position: _slideAnimation,
              child: Image.asset(
                'assets/images/logo_white.png',
                width: 56,
                height: 70,
                errorBuilder: (context, error, stackTrace) {
                  print('❌ 이미지 로딩 에러: $error');
                  return const Text(
                    'WAAL',
                    style: TextStyle(color: Colors.white, fontSize: 32),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
