import { getCurrentUserDecorator } from './getCurrentUser.decorator';
import { IsPublic } from './isPublic.decorator';

// const common = {
//   getCurrentUser: getCurrentUserDecorator,
//   AllowAnonymous: IsPublic,
// };

const getCurrentUser = getCurrentUserDecorator;
const AllowAnonymous = IsPublic;

export { getCurrentUser, AllowAnonymous };
