"use client";

import MainContainer from "../components/MainContainer";
import PageHeader from "../components/PageHeader";

export default function PrivacyPage() {
  return (
    <MainContainer bg="#ffffff">
      <div className="w-full min-h-dvh pb-[100px]">
        {/* Close 버튼 영역 */}
        <PageHeader variant="close" />

        {/* 제목 */}
        <div className="pt-4 sm:pt-[62px] pb-4">
          <h1 className="text-[25px] font-bold text-[#363e4a] leading-normal">
            개인정보처리방침
          </h1>
        </div>

        {/* 내용 */}
        <div className="flex flex-col gap-[18px]">
          {/* 서문 */}
          <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
            <p className="text-[13px] leading-[17px] text-black font-normal">
              디버깅히어로즈(이하 &quot;회사&quot;)는 「개인정보 보호법」 등
              관련 법령을 준수하며, 이용자의 개인정보를 보호하기 위하여 최선을
              다하고 있습니다.
              <br />
              회사는 본 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가
              어떠한 목적과 방식으로 이용되는지 안내합니다.
            </p>
          </div>

          {/* 1. 개인정보의 수집 및 이용 목적 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              1. 개인정보의 수집 및 이용 목적
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <div className="text-[13px] text-black font-normal">
                <p className="leading-[17px] mb-0">
                  회사는 다음의 목적을 위해 개인정보를 수집 및 이용합니다.
                </p>
                <ul className="list-disc mt-0">
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      회원 가입 및 이용자 식별
                    </span>
                  </li>
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      애견유치원 예약 및 관리 서비스 제공
                    </span>
                  </li>
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      등원 알림, 예약 알림 등 서비스 관련 안내 제공
                    </span>
                  </li>
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      예약 내역 확인 및 서비스 운영을 위한 연락
                    </span>
                  </li>
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      고객 문의 응대 및 공지사항 전달
                    </span>
                  </li>
                  <li className="ml-[19.5px]">
                    <span className="leading-[17px]">
                      서비스 품질 개선 및 안정적인 운영
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. 수집하는 개인정보 항목 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              2. 수집하는 개인정보 항목
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <div className="text-[13px] text-black font-normal">
                <p className="leading-[17px] mb-0">① 보호자 회원</p>
                <ul className="list-disc mb-0">
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      필수항목: 이름, 이메일 주소, 휴대전화번호
                    </span>
                  </li>
                  <li className="ml-[19.5px]">
                    <span className="leading-[17px]">
                      선택항목: 반려견 정보(이름, 나이, 견종 등)
                    </span>
                  </li>
                </ul>
                <p className="leading-[17px] mb-0">② 유치원 사업자 회원</p>
                <ul className="list-disc mb-0">
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      필수항목: 사업자명, 담당자 이름, 연락처, 이메일 주소
                    </span>
                  </li>
                  <li className="ml-[19.5px]">
                    <span className="leading-[17px]">
                      선택항목: 사업자등록번호, 유치원 운영 정보
                    </span>
                  </li>
                </ul>
                <p className="leading-[17px] mb-0">
                  ③ 서비스 이용 과정에서 자동 수집되는 정보
                </p>
                <ul className="mb-0">
                  <li className="list-disc ml-[19.5px]">
                    <span className="leading-[17px]">
                      IP 주소, 접속 로그, 기기 정보, 운영체제 정보
                    </span>
                  </li>
                </ul>
                <p className="leading-[17px] mb-0">④ 알림 서비스 이용 시</p>
                <ul>
                  <li className="list-disc ml-[19.5px]">
                    <span className="leading-[17px]">
                      푸시 알림 토큰(등원 알림, 예약 알림 등 서비스 알림 발송
                      목적)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. 개인정보의 보유 및 이용 기간 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              3. 개인정보의 보유 및 이용 기간
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <div className="text-[13px] leading-[17px] text-black font-normal">
                <p className="mb-0">
                  회사는 개인정보 수집 및 이용 목적이 달성되면 해당 정보를 지체
                  없이 파기합니다.
                  <br />
                  단, 관련 법령에 따라 일정 기간 보관이 필요한 경우는 아래와
                  같습니다.
                </p>
                <p className="mt-[10px] mb-0">
                  항목보존 기간근거 법령계약 또는 청약철회
                  기록5년전자상거래법소비자 불만 및 분쟁 처리
                  기록3년전자상거래법
                </p>
              </div>
            </div>
          </div>

          {/* 4. 개인정보의 제3자 제공 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              4. 개인정보의 제3자 제공
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <p className="text-[13px] leading-[17px] text-black font-normal">
                회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다.
                <br />
                다만, 법령에 따라 제공이 요구되는 경우는 예외로 합니다.
              </p>
            </div>
          </div>

          {/* 5. 개인정보 처리의 위탁 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              5. 개인정보 처리의 위탁
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <div className="text-[13px] leading-[17px] text-black font-normal">
                <p className="mb-0">
                  회사는 원활한 서비스 운영을 위해 개인정보 처리 업무를 외부에
                  위탁할 수 있습니다.
                </p>
                <p className="mb-0">
                  수탁업체위탁 내용클라우드 서비스 제공업체(AWS, Firebase
                  등)데이터 보관 및 서버 운영푸시 알림 서비스 제공업체서비스
                  알림 발송
                </p>
                <p>
                  회사는 위탁 계약 시 개인정보 보호 관련 법령을 준수하도록
                  관리·감독합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 6. 앱 접근 권한 안내 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              6. 앱 접근 권한 안내
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <div className="text-[13px] text-black font-normal">
                <p className="leading-[17px] mb-0">
                  회사는 서비스 제공을 위해 아래와 같은 접근 권한을 필요로
                  합니다.
                </p>
                <p className="leading-[17px] mb-0">필수 접근 권한</p>
                <ul className="mb-0">
                  <li className="list-disc ml-[19.5px]">
                    <span className="leading-[17px]">없음</span>
                  </li>
                </ul>
                <p className="leading-[17px] mb-0">선택 접근 권한</p>
                <ul className="list-disc mb-0">
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      카메라: 반려견 사진 촬영, 앨범 콘텐츠 업로드 시 사용
                    </span>
                  </li>
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      사진/앨범: 반려견 사진 및 콘텐츠 업로드 시 사용
                    </span>
                  </li>
                  <li className="ml-[19.5px]">
                    <span className="leading-[17px]">
                      알림: 등원 알림, 예약 알림 등 서비스 관련 알림 제공
                    </span>
                  </li>
                </ul>
                <p className="leading-[17px]">
                  ※ 선택 접근 권한은 허용하지 않아도 서비스 이용이 가능하나,
                  일부 기능 사용에 제한이 있을 수 있습니다.
                  <br />※ 접근 권한은 단말기 설정을 통해 언제든지 변경할 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 7. 이용자의 권리 및 행사 방법 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              7. 이용자의 권리 및 행사 방법
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <p className="text-[13px] leading-[17px] text-black font-normal">
                이용자는 언제든지 자신의 개인정보에 대해 조회, 수정, 삭제, 처리
                정지를 요청할 수 있습니다.
                <br />
                관련 요청은 서비스 내 문의 또는 이메일을 통해 접수할 수
                있습니다.
              </p>
            </div>
          </div>

          {/* 8. 개인정보의 파기 절차 및 방법 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              8. 개인정보의 파기 절차 및 방법
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <ul className="text-[13px] text-black font-normal">
                <li className="mb-0 ml-[19.5px]">
                  <span className="leading-[17px]">
                    파기 절차: 개인정보 이용 목적 달성 후 즉시 파기
                  </span>
                </li>
                <li className="mb-0 ml-[19.5px]">
                  <span className="leading-[17px]">파기 방법</span>
                </li>
                <ul className="list-disc">
                  <li className="mb-0 ml-[39px]">
                    <span className="leading-[17px]">
                      전자적 파일: 복구 불가능한 방법으로 삭제
                    </span>
                  </li>
                  <li className="ml-[39px]">
                    <span className="leading-[17px]">
                      종이 문서: 분쇄 또는 소각
                    </span>
                  </li>
                </ul>
              </ul>
            </div>
          </div>

          {/* 9. 개인정보의 안전성 확보 조치 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              9. 개인정보의 안전성 확보 조치
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <div className="text-[13px] text-black font-normal">
                <p className="leading-[17px] mb-0">
                  회사는 개인정보 보호를 위해 다음과 같은 조치를 취하고
                  있습니다.
                </p>
                <ul className="list-disc">
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      개인정보 접근 권한 제한
                    </span>
                  </li>
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">개인정보 암호화</span>
                  </li>
                  <li className="ml-[19.5px]">
                    <span className="leading-[17px]">
                      보안 프로그램 설치 및 주기적 점검
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 10. 개인정보 보호책임자 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              10. 개인정보 보호책임자
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <ul className="text-[13px] text-black font-normal">
                <li className="mb-0 ml-[19.5px]">
                  <span className="leading-[17px]">성명: 박신우</span>
                </li>
                <li className="mb-0 ml-[19.5px]">
                  <span className="leading-[17px]">
                    직책: 개인정보 보호책임자
                  </span>
                </li>
                <li className="ml-[19.5px]">
                  <span className="leading-[17px]">
                    이메일: bugwow@naver.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 11. 개인정보처리방침의 변경 */}
          <div className="flex flex-col gap-[5px]">
            <p className="text-[13px] leading-[17px] text-black font-semibold">
              11. 개인정보처리방침의 변경
            </p>
            <div className="bg-[#f9f9f9] rounded-[7px] p-[20px]">
              <div className="text-[13px] text-black font-normal">
                <p className="leading-[17px] mb-0">
                  본 개인정보처리방침은 최초 게시일로부터 시행됩니다.
                </p>
                <ul className="list-disc">
                  <li className="mb-0 ml-[19.5px]">
                    <span className="leading-[17px]">
                      공고일자: 2026년 01월 12일
                    </span>
                  </li>
                  <li className="ml-[19.5px]">
                    <span className="leading-[17px]">
                      시행일자: 2026년 01월 12일
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 하단 여백 */}
          <div className="h-[91px]" />
        </div>
      </div>
    </MainContainer>
  );
}
