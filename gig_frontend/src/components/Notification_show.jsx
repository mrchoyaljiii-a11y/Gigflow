import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    FaBell,
    FaCheckCircle,
    FaTimesCircle,
    FaMoneyBill,
    FaEnvelope,
} from "react-icons/fa";
import { fetchNotifications, Show_notification_component, addNotification, ReadNotification } from '../redux/Notification_actions/Notifications_actions';
import { NavLink } from 'react-router-dom';

const Notification_show = () => {

    const dispatch = useDispatch();
    const { notifications } = useSelector(
        (state) => state.Notification_actions_slice
    );

    const notificationList = notifications || [];

    const getIcon = (type) => {
        switch (type) {
            case "bid":
                return <FaBell className="text-blue-500" />;
            case "message":
                return <FaEnvelope className="text-purple-500" />;
            case "BID_ACCEPTED":
                return <FaCheckCircle className="text-green-500" />;
            case "BID_REJECTED":
                return <FaTimesCircle className="text-red-500" />;
            case "payment":
                return <FaMoneyBill className="text-yellow-500" />;
            default:
                return <FaBell className="text-gray-400" />;
        }
    };

    const CreateNavlink = (notification) => {
        const bid_id = notification.link;
        const job_id = notification.link;
        switch (notification.type) {
            case "BID_VIEWED":
                return `/home/freelancer/detailed-bid/${bid_id}`;
            case "BID_RECEIVED":
                return `/home/detailed_job_info/${job_id}`;
            default:
                return `/home`;
        }
    }

    const formatTime = (time) => {
        return new Date(time).toLocaleString();
    };

    const unreadCount = notificationList.filter(n => !n.isRead).length;

    return (
        <div className="w-full max-w-md mx-auto mt-6 bg-white shadow-xl rounded-2xl p-4">

            {/*  Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-3">
                <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    🔔 Notifications
                    <span className="text-sm text-gray-500">
                        ({unreadCount} New)
                    </span>
                </h1>

                <button onClick={() => dispatch(Show_notification_component(false))}>
                    <FaTimesCircle className="text-gray-400 hover:text-gray-600 text-xl" />
                </button>
            </div>

            {/* if no notification */}
            {notificationList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <FaBell className="text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                    <p className="text-gray-400 text-xs mt-1">
                        You’ll see updates here when something happens
                    </p>
                </div>
            ) : (

                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {notificationList.map((notification) => (

                        <NavLink to={CreateNavlink(notification)} key={notification._id}
                            onClick={() => {
                                dispatch(Show_notification_component(false))
                                dispatch(ReadNotification(notification._id))
                            }}>

                            <div
                                key={notification._id}
                                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer
                            ${!notification.isRead
                                        ? "bg-blue-50 border-l-4 border-blue-500"
                                        : "bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >


                                {/* Icon */}
                                <div className="text-lg mt-1">
                                    {getIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800 font-medium">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatTime(notification.createdAt)}
                                    </p>

                                </div>

                                {/* Unread dot */}
                                {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                )}
                            </div>
                        </NavLink>

                    ))}
                </div>
            )}

        </div>
    );
};

export default Notification_show;