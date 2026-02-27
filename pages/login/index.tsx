import CustomButton from "../../components/button/indx";
import { CustomInput } from "../../components/input";
import "../../global.scss";
import "./login.scss";

export default function LoginPage() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="offset-4 col-4">
          <div className="loginbox">
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <div className="Signin">
                  <span className="highlight">Si</span>gn in
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <div id="errorContainer"></div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-12">
                <CustomInput
                  labeltext={"Email address"}
                  type={"text"}
                  id={"signIn"}
                  placeholder={"Example@mail.com"}
                  className={"inputsignin"}
                />
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-12">
                <CustomInput
                  labeltext={"Password"}
                  type={"password"}
                  id={"Password"}
                  placeholder={"Enter your password"}
                  className={"inputsignin"}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <CustomButton
                  className={"buttonsignin"}
                  id={"login"}
                  buttontext={"Login"}
                />

                {/* <button className="buttonsignin" id="login" type="submit">
                  Login
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
