import React, { useEffect, useState } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import { Scrollbars } from 'react-custom-scrollbars';
import { findUser } from 'apis';
import LoadImage from 'components/common/LoadImage';

const OnlineList = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        async function fetchUserList(){
            try{
                const result = await findUser(null, 0, 50);
                setUserList(result.data);
            }catch(e){
                console.log(e);
            }
        }

        if(!userList.length){
            fetchUserList();
        }
        //eslint-disable-next-line
    }, []);

    return (
        <div className="right">
            <div className="menu menu-fixed">
                <div className="menu-title">
                    <h2>Người liên hệ</h2>
                    <button className="btn-search">
                        <RiSearch2Line size={24}/>
                    </button>
                </div>
                <Scrollbars autoHide style={{height: "calc(100% - 40px)"}}>
                    <ul>
                        {userList.map((user) => 
                            <li key={user._id}>
                                <div className="menu-item">
                                    <div className="menu-item__icon">
                                        <LoadImage src={user.avatar} alt={user.fullName}/>
                                        {user.online ? <span className="menu-item__icon-online"></span> : <span className="menu-item__icon-offline"></span>}
                                    </div>
                                    <div className="menu-item__item">
                                        {user.fullName}
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                </Scrollbars>
            </div>
        </div>
    );
};

export default OnlineList;