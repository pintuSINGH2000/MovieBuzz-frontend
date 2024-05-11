import React, { useContext, useEffect, useState } from "react";
import "./profile.scss";
import { AuthContext } from "../../context/authContext/AuthContext";
import { updateUser } from "../../context/authContext/apiCalls";

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [username, setUserName] = useState(user.username);
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [member, setMember] = useState("silver");
  const [ProfileChange, setProfileChange] = useState(false);
  const [isUpdating,setIsUpdating] = useState(false);

  useEffect(() => {
    if (user.plan === 3) {
      setMember("red");
    } else if (user.plan === 2) {
      setMember("gold");
    } else {
      setMember("silver");
    }
  }, [user.plan]);

  useEffect(() => {
    if (user.profilePic && user.profilePic.data) {
      const uint8Array = new Uint8Array(user?.profilePic?.data?.data);
      const blob = new Blob([uint8Array], {
        type: user.profilePic?.contentType,
      });
      setProfilePic(blob);
    }
  }, [user.profilePic]);

  const handleUpdate = async (e) => {
    if(isUpdating) return;
    e.preventDefault();
    if (!username && !password && !profilePic) return;
    const profileData = new FormData();
    username&&profileData.append("username", username);
    if (ProfileChange) {
      profilePic && profileData.append("profilePic", profilePic);
    }
    password && profileData.append("passwd", password);
    setIsUpdating(true);
    await updateUser(user._id, profileData, dispatch);
    setIsUpdating(false);
   setPassword(null);
   setUserName(null);
   setProfileChange(null);
  };

  return (
    <div className="user">
      <div style={{ border: `5px solid ${member}` }} className="ProfilePic">
        <img
          src={
            profilePic ? URL.createObjectURL(profilePic) : "../image/user.png"
          }
          alt="profile_pic"
        />
        <label
          className="changePic"
          for="profile_pic"
          id="profile_label"
          style={{ cursor: "pointer" }}
        >
          Change
        </label>
        <input
          type="file"
          id="profile_pic"
          name="image"
          accept="image/*"
          onChange={(e) => {
            setProfilePic(e.target.files[0]);
            setProfileChange(true);
          }}
        />
      </div>
      <div className="userDetail">
        <input
          value={username}
          name="name"
          onChange={(e) => setUserName(e.target.value)}
        />
        <input value={user.email} name="email" readonly />
        <input
          placeholder="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="logginButton" onClick={handleUpdate}>
          {isUpdating}
          {isUpdating?"Updating...":"Update"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
