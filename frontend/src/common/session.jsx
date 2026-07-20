const storeInSession = (key, value) => {
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
};

const lookInSession = (key) => {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
};

const removeFromSession = (key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
};

const logOutUser = () => {
    sessionStorage.clear();
    localStorage.clear();
};

export { storeInSession, lookInSession, removeFromSession, logOutUser };