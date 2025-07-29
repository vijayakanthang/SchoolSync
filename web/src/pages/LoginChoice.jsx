import React, { useState } from 'react';
import "../styles/loginchoice.css";
import SchoolSync from "../assets/ss9-16.png";
import ParentImage from "../assets/parent.png";
import StudentImage from "../assets/student.png";
import TeacherImage from "../assets/teacher.png";
import Login from './Login';
import Register from './Register';

function LoginChoice() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleClick = (role) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    if (showRegister) {
      setShowRegister(false);
    } else {
      setSelectedRole(null);
    }
  };

  return (
    <div className='choice-div'>
      <img id="logo" src={SchoolSync} alt="schoolsynclogo" />

      <div className={`login-choice ${selectedRole ? "role-selected" : ""}`}>
        <div
          className={`choice-container parent ${selectedRole === 'parent' ? 'selected' : selectedRole ? 'hide' : ''}`}
          style={{ backgroundImage: `url(${ParentImage})` }}
          onClick={() => handleClick('parent')}
        >
          Parent
        </div>

        <div
          className={`choice-container student ${selectedRole === 'student' ? 'selected' : selectedRole ? 'hide' : ''}`}
          style={{ backgroundImage: `url(${StudentImage})` }}
          onClick={() => handleClick('student')}
        >
          Student
        </div>

        <div
          className={`choice-container teacher ${selectedRole === 'teacher' ? 'selected' : selectedRole ? 'hide' : ''}`}
          style={{ backgroundImage: `url(${TeacherImage})` }}
          onClick={() => handleClick('teacher')}
        >
          Teacher
        </div>

        {selectedRole && (
          <div className="popup-login">
            {showRegister ? (
              <Register
                role={selectedRole}
                onBack={handleBack}
              />
            ) : (
              <Login
                role={selectedRole}
                onBack={handleBack}
                onSwitchToRegister={() => setShowRegister(true)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginChoice;
