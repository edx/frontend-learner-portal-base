import qs from 'query-string';

import apiClient from '../../../../../apiClient';

// eslint-disable-next-line import/prefer-default-export
export const markCourseAsCompleteRequest = (options) => {
  const endpoint = '/enterprise_learner_portal/api/v1/enterprise_course_enrollments/';
  let url = `${process.env.LMS_BASE_URL}${endpoint}`;
  if (options) {
    url += `?${qs.stringify(options)}`;
  }
  return apiClient.patch(url);
};
