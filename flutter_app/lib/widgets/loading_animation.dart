import 'package:flutter/material.dart';

/// 웹뷰 로딩 중 표시되는 스피너 + 로고
/// 로딩 시작과 동시에 즉시 표시
/// ease-in-out 애니메이션: 느리게 → 빠르게 → 느리게
class LoadingIndicator extends StatefulWidget {
  const LoadingIndicator({super.key});

  @override
  State<LoadingIndicator> createState() => _LoadingIndicatorState();
}

class _LoadingIndicatorState extends State<LoadingIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  // 브랜드 컬러
  static const Color brandColor = Color(0xFF3F55FF);

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    // ease-in-out: 느리게 시작 → 빠르게 → 느리게 끝
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );

    _controller.repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Center(
        child: Opacity(
          opacity: 0.8,
          child: SizedBox(
            width: 60,
            height: 60,
            child: RotationTransition(
              turns: _animation,
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: const Color(0xFFE8EBFF),
                    width: 5,
                  ),
                ),
                child: CustomPaint(
                  painter: _SpinnerPainter(brandColor),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 스피너 호(arc) 그리기
class _SpinnerPainter extends CustomPainter {
  final Color color;

  _SpinnerPainter(this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    // 90도 호 그리기
    canvas.drawArc(rect, -0.5, 1.5, false, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
