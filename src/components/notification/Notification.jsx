import "./notification.scss";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
const Notification = ({content}) => {
  return (
          <div className ="notification">
              <div className="icon">
                  <CircleNotificationsIcon className="icon_ele"/>
              </div>
              <div className="text">
                    {content}
              </div>
          </div>
  );
};

export default Notification;