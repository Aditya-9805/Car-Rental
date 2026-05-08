import {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import axios from 'axios';

import toast from 'react-hot-toast';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import app from "../firebase";

const auth = getAuth(app);

const provider =
  new GoogleAuthProvider();

const AppContext =
  createContext();

export const useAppContext =
  () => useContext(AppContext);

const backendUrl =
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:5000';

export const AppContextProvider =
  ({ children }) => {

    const [user, setUser] =
      useState(null);

    const [token, setToken] =
      useState(

        localStorage.getItem(
          'token'
        ) || ''

      );

    const [isOwner, setIsOwner] =
      useState(

        localStorage.getItem(
          'isOwner'
        ) === 'true'

      );

    const [cars, setCars] =
      useState([]);

    const [pickupDate, setPickupDate] =
      useState('');

    const [returnDate, setReturnDate] =
      useState('');

    const [showLogin, setShowLogin] =
      useState(false);

    // AXIOS INTERCEPTOR
    useEffect(() => {

      const interceptor =
        axios.interceptors.request.use(

          (config) => {

            if (token) {

              config.headers.Authorization =
                `Bearer ${token}`;
            }

            return config;
          },

          (error) =>
            Promise.reject(error)
        );

      return () =>

        axios.interceptors.request.eject(
          interceptor
        );

    }, [token]);

    // FETCH USER
    const fetchUser =
      async () => {

        try {

          const { data } =
            await axios.get(

              `${backendUrl}/api/user/data`

            );

          if (data.success) {

            setUser(data.user);

            const ownerStatus =
              data.user.role === 'owner';

            setIsOwner(
              ownerStatus
            );

            localStorage.setItem(

              'isOwner',

              ownerStatus

            );
          }

        } catch (error) {

          console.log(error);

        }
      };

    // FIREBASE AUTH STATE
    useEffect(() => {

      const unsubscribe =
        onAuthStateChanged(

          auth,

          async (currentUser) => {

            if (currentUser) {

              const firebaseToken =
                await currentUser.getIdToken();

              setToken(
                firebaseToken
              );

              localStorage.setItem(

                'token',

                firebaseToken

              );

              await fetchUser();

            } else {

              setUser(null);

              setToken('');

              setIsOwner(false);

              localStorage.removeItem(
                'token'
              );

              localStorage.removeItem(
                'isOwner'
              );
            }
          }
        );

      return () => unsubscribe();

    }, []);

    // FETCH CARS
    const fetchCars =
      async () => {

        try {

          const { data } =
            await axios.get(

              `${backendUrl}/api/user/cars`

            );

          if (data.success) {

            setCars(data.cars);

          }

        } catch (error) {

          console.log(error);

        }
      };

    // LOGIN
    const login =
      async (
        email,
        password
      ) => {

        try {

          await signInWithEmailAndPassword(

            auth,

            email,

            password

          );

          toast.success(
            "Login Successful"
          );

          setShowLogin(false);

        } catch (error) {

          toast.error(
            error.message
          );
        }
      };

    // GOOGLE LOGIN
    const googleLogin =
      async () => {

        try {

          await signInWithPopup(

            auth,

            provider

          );

          toast.success(

            "Google Login Successful"

          );

          setShowLogin(false);

        } catch (error) {

          toast.error(
            error.message
          );
        }
      };

    // REGISTER
    const registerUser =
      async (
        name,
        email,
        password
      ) => {

        try {

          await createUserWithEmailAndPassword(

            auth,

            email,

            password

          );

          toast.success(

            "Account Created Successfully"

          );

          setShowLogin(false);

        } catch (error) {

          toast.error(
            error.message
          );
        }
      };

    // LOGOUT
    const logout =
      async () => {

        try {

          await signOut(auth);

          setUser(null);

          setToken('');

          setIsOwner(false);

          localStorage.removeItem(
            'token'
          );

          localStorage.removeItem(
            'isOwner'
          );

          toast.success(

            'Logged out successfully'

          );

        } catch (error) {

          console.log(
            error.message
          );
        }
      };

    // CHANGE ROLE
    const changeRole =
      async () => {

        try {

          const { data } =
            await axios.post(

              `${backendUrl}/api/owner/change-role`

            );

          if (data.success) {

            setIsOwner(true);

            localStorage.setItem(
              'isOwner',
              'true'
            );

            toast.success(
              data.message
            );
          }

        } catch (error) {

          toast.error(

            error.response?.data?.message ||

            'Failed to change role'

          );
        }
      };

    // INITIAL FETCH
    useEffect(() => {

      fetchCars();

    }, []);

    const value = {

      backendUrl,

      user,
      setUser,

      token,
      setToken,

      isOwner,
      setIsOwner,

      cars,
      setCars,

      pickupDate,
      setPickupDate,

      returnDate,
      setReturnDate,

      showLogin,
      setShowLogin,

      fetchCars,
      fetchUser,

      login,
      googleLogin,
      registerUser,

      logout,
      changeRole,
    };

    return (

      <AppContext.Provider value={value}>

        {children}

      </AppContext.Provider>
    );
  };

export default AppContext;