import { useState } from "react";

export default function ProfileLink() {
  const [state, setState] = useState("Karim");

  return (
    <a href="/my-profile.html" className="side-menu-link">
      <div className="side-menu-item">
        <div className="side-menu-profile ">
          <img src="/assets/imge/avatar_holder_dashboard.gif" alt="user" />
        </div>
        <div className="side-menu-title profile-name">{state}</div>
      </div>
    </a>
  );
}
