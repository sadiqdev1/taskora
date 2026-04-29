import AppealController from './AppealController'
import AdminController from './AdminController'
import MemeController from './MemeController'
import CommentController from './CommentController'
import ProfileController from './ProfileController'
import FollowController from './FollowController'
import NotificationController from './NotificationController'
import Settings from './Settings'
import SubscriptionController from './SubscriptionController'
const Controllers = {
    AppealController: Object.assign(AppealController, AppealController),
AdminController: Object.assign(AdminController, AdminController),
MemeController: Object.assign(MemeController, MemeController),
CommentController: Object.assign(CommentController, CommentController),
ProfileController: Object.assign(ProfileController, ProfileController),
FollowController: Object.assign(FollowController, FollowController),
NotificationController: Object.assign(NotificationController, NotificationController),
Settings: Object.assign(Settings, Settings),
SubscriptionController: Object.assign(SubscriptionController, SubscriptionController),
}

export default Controllers