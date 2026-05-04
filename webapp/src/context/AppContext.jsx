import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('careerPlatformUserData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Error parsing user data from local storage', e);
      }
    }
    return {
      id: '',
      name: 'Guest',
      email: '',
      token: '',
      targetRole: '',
      qualification: '',
      confidence: 5,
      skills: [],
      hasCompletedAssessment: false,
      isLoggedIn: false,
      currentLevel: 1,
      testScores: []
    };
  });

  const updateUserData = (data) => {
    setUserData(prev => {
      const newData = { ...prev, ...data };
      localStorage.setItem('careerPlatformUserData', JSON.stringify(newData));
      return newData;
    });
  };

  const logout = () => {
    localStorage.removeItem('careerPlatformUserData');
    localStorage.removeItem('careerPlatformToken');
    setUserData({
      id: '',
      name: 'Guest',
      email: '',
      token: '',
      targetRole: '',
      qualification: '',
      confidence: 5,
      skills: [],
      hasCompletedAssessment: false,
      isLoggedIn: false,
      currentLevel: 1,
      testScores: []
    });
  };

  return (
    <AppContext.Provider value={{ userData, updateUserData, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
