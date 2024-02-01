export const BaseResponse = {
  DATEGROUP_CREATED: {
    success: true,
    code: 201,
    message: '날짜 그룹이 생성되었습니다.',
  },
  JOURNEY_CREATED: {
    success: true,
    code: 201,
    message: '여정이 저장되었습니다.',
  },
  SCHEDULE_UPDATED: {
    success: true,
    code: 201,
    message: '일정을 작성했습니다.',
  },

  /* 404 NOT_FOUND : Resource 를 찾을 수 없음 */
  SCHEDULE_NOT_FOUND: {
    success: false,
    code: 404,
    message: '스케줄이 없습니다.',
  },
};