// src/services/alertService.ts

import prisma from '../prisma';

export const sendKeywordAlerts = async (entity: any) => {
  const content = entity.content || entity.title;

  // content가 없으면 함수 종료
  if (!content) {
    return;
  }

  try {
    const alerts = (await prisma.keywordAlert.findMany()) || [];

    alerts.forEach((alert: { keyword: string; authorName: string }) => {
      if (content.includes(alert.keyword)) {
        // 실제 알림 보내는 기능은 구현하지 않음
        console.log(
          `알림: ${alert.authorName}님이 등록한 키워드 "${alert.keyword}"가 포함되었습니다.`
        );
      }
    });
  } catch (error) {
    console.error('Error in sendKeywordAlerts:', error);
    // 알림 기능 실패 시 예외를 던지지 않고 로그만 출력
  }
};
