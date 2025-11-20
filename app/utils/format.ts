/**
 * 전화번호 입력 시 자동 포맷팅 (하이픈 추가)
 * 예: "01012345678" -> "010-1234-5678"
 */
export function formatPhoneNumberInput(value: string): string {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, "");

  // 길이에 따라 하이픈 추가
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
}

/**
 * 11자리 전화번호를 표시용 포맷으로 변환
 * 예: "01012345678" -> "010-1234-5678"
 */
export function formatPhoneNumberDisplay(phoneNumber: string): string {
  if (phoneNumber.length === 11) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  }
  return phoneNumber;
}

/**
 * 전화번호에서 하이픈 제거
 * 예: "010-1234-5678" -> "01012345678"
 */
export function removePhoneNumberHyphens(phoneNumber: string): string {
  return phoneNumber.replace(/-/g, "");
}

/**
 * 인증번호 입력 포맷팅 (숫자만 6자리)
 */
export function formatVerificationCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

/**
 * 이름 입력 필터링 (한글과 영어만 허용)
 */
export function formatName(value: string): string {
  return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s]/g, "");
}

/**
 * 타이머 시간 포맷팅 (초 -> MM:SS)
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
