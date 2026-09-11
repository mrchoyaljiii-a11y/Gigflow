import { Outlet } from "react-router-dom";
import ShowToast from "../Toasts/ShowToast";
import Notification_show from "../Notification_show";
import { useSelector } from "react-redux";


const GlobalLayout = () => {
     const { showNotification } = useSelector(
    (state) => state.Notification_actions_slice
  );

    return (
        <>
            <Outlet />

            {/* Global Components */}
            <ShowToast />
            {showNotification && (
                <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-black/20 backdrop-blur-sm">
                    <Notification_show />
                </div>
            )}
        </>
    );
};

export default GlobalLayout;