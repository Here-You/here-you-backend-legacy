export const BaseResponse = {
  /* 200 OK : 요청 성공 */
  DELETE_DETAIL_SCHEDULE_SUCCESS: {
    success: true,
    code: 200,
    message: '세부 일정을 삭제했습니다.',
  },
  UPDATE_DETAIL_SCHEDULE_STATUS_SUCCESS: {
    success: true,
    code: 200,
    message: '세부 일정 상태를 변경했습니다',
  },
  GET_MONTHLY_JOURNEY_SUCCESS: {
    success: true,
    code: 200,
    message: '월별 여정을 불러오는데 성공했습니다.',
  },
  GET_JOURNEY_PREVIEW_SUCCESS: {
    success: true,
    code: 200,
    message: '여정을 불러오는데 성공했습니다.',
  },
  GET_DIARY_SUCCESS: {
    success: true,
    code: 200,
    message: '일지를 불러오는데 성공했습니다.',
  },

  /* 201 CREATED : 요청 성공, 자원 생성 */
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

  DETAIL_SCHEDULE_CREATED: {
    success: true,
    code: 201,
    message: '세부 일정을 추가했습니다.',
  },
  DETAIL_SCHEDULE_UPDATED: {
    success: true,
    code: 201,
    message: '세부 일정을 작성했습니다.',
  },
  DIARY_CREATED: {
    success: true,
    code: 201,
    message: '일지를 작성했습니다.',
  },
  DIARY_UPDATED: {
    success: true,
    code: 201,
    message: '일지를 수정했습니다.',
  },
  DIARY_IMG_URL_CREATED: {
    success: true,
    code: 201,
    message: '이미지 url이 발급되었습니다.',
  },

  /* 404 NOT_FOUND : Resource 를 찾을 수 없음 */

  USER_NOT_FOUND: {
    success: false,
    code: 404,
    message: '사용자가 없습니다.',
  },

  JOURNEY_NOT_FOUND: {
    success: false,
    code: 404,
    message: '아직 작성한 여정이 없어요!',
  },

  SCHEDULE_NOT_FOUND: {
    success: false,
    code: 404,
    message: '스케줄이 없습니다.',
  },
  DETAIL_SCHEDULE_NOT_FOUND: {
    success: false,
    code: 404,
    message: '세부 일정이 없습니다.',
  },
  DIARY_NOT_FOUND: {
    success: false,
    code: 404,
    message: '일지가 없습니다.',
  },
};
