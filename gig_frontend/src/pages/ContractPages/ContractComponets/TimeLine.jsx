import React from 'react'

const TimeLine = ({ status, isLast, bgColor, Icon,iconColor}) => {
 return (
        <div className="flex flex-col items-center">
            <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${bgColor}`}
            >
                <Icon size={18} className={iconColor}/>
            </div>
            {!isLast && <div className="w-0.5 flex-1 bg-gray-200 " />}
        </div>
    );
}

export default TimeLine
