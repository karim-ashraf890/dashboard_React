import { useEffect, useState } from "react";

export default function ProfileLink() {
  const [name, setName] = useState("Karim");

  useEffect(() => {
    let user = localStorage.getItem("user");
    const userObj = JSON.parse(user);
    if (!userObj || !userObj.admin) return;
    const fullName = userObj.admin.first_name + " " + userObj.admin.last_name;
    setName(fullName);
  }, []);

  return (
    <a href="/my-profile.html" className="side-menu-link">
      <div className="side-menu-item">
        <div className="side-menu-profile ">
          <img src="/assets/imge/avatar_holder_dashboard.gif" alt="user" />
        </div>
        <div className="side-menu-title profile-name">{name}</div>
      </div>
    </a>
  );
}
