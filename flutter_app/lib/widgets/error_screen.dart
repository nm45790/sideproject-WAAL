import 'package:flutter/material.dart';

/// WebView 로딩 실패 시 표시되는 에러 화면
class ErrorScreen extends StatelessWidget {
  /// 다시 시도 버튼 콜백
  final VoidCallback onRetry;

  /// 에러 메시지 (선택)
  final String? errorMessage;

  const ErrorScreen({
    super.key,
    required this.onRetry,
    this.errorMessage,
  });

  // 브랜드 컬러
  static const Color brandColor = Color(0xFF3F55FF);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // 에러 아이콘
              Container(
                width: 88,
                height: 88,
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F3FF), // 연한 브랜드 컬러 배경
                  borderRadius: BorderRadius.circular(44),
                ),
                child: const Icon(
                  Icons.wifi_off_rounded,
                  size: 44,
                  color: brandColor,
                ),
              ),
              const SizedBox(height: 24),

              // 에러 제목
              const Text(
                '앗, 연결이 안 돼요!',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF212121),
                ),
              ),
              const SizedBox(height: 12),

              // 에러 설명
              const Text(
                '인터넷 연결 상태를 확인하고\n다시 시도해 주세요.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: Color(0xFF757575),
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 32),

              // 다시 시도 버튼
              SizedBox(
                width: 120,
                height: 48,
                child: ElevatedButton(
                  onPressed: onRetry,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: brandColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    '다시 시도',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
