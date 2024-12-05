"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth, fs } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import UserDropdown from "./UserDropDown";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import SearchItem from "./components/SearchItem";
import { Item } from "./Types";

const icon = {
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-full text-red-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  ),
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-full text-green-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
      />
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-full text-amber-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  ),
};

const Overlay = ({ onClose }: { onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    label: string;
    color: string;
  }>({
    label: "Weak",
    color: "text-red-500",
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validateFullName = (fullname: string) => /^[A-Za-z\s]+$/.test(fullname);
  const validatePasswordStrength = (password: string) => {
    if (password.length < 5) return { label: "Weak", color: "text-red-500" };
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    )
      return { label: "Strong", color: "text-green-500" };
    return { label: "Weak", color: "text-red-500" };
  };

  const handlePasswordChange = (password: string) => {
    const strength = validatePasswordStrength(password);
    setPasswordStrength(strength); // Pass both label and color
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullname = (e.target as HTMLFormElement).fullname.value.trim();
    const email = (e.target as HTMLFormElement).email.value.trim();
    const password = (e.target as HTMLFormElement).password.value;
    const confirmPassword = (e.target as HTMLFormElement).confirmPassword.value;

    if (!validateFullName(fullname)) {
      toast.error("Full Name must only contain letters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        toast.success("Registration successful!");
        updateProfile(userCredential.user, { displayName: fullname });
        const userRef = collection(fs, "users");
        await setDoc(doc(userRef, userCredential.user.uid), {
          name: fullname,
          email: email,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        onClose();
      })
      .catch(() => {
        toast.error("Invalid email or password.");
      });
  };

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value.trim();
    const password = (e.target as HTMLFormElement).password.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success("Login successful! Welcome back.");
        onClose();
      })
      .catch(() => {
        toast.error("Invalid email or password.");
      });
  };

  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white shadow-lg flex flex-col p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        {isLogin ? (
          <form onSubmit={signIn} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                className="border border-gray-300 w-full p-2 rounded-md focus:ring focus:ring-blue-300"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring focus:ring-blue-300"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button className="bg-foreground text-white py-2 rounded-md w-full hover:bg-foreground/60">
              Sign In
            </button>
            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <span
                className="text-foreground cursor-pointer hover:underline"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={signUp} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                className="border border-gray-300 w-full p-2 rounded-md focus:ring focus:ring-blue-300"
                type="text"
                name="fullname"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                className="border border-gray-300 w-full p-2 rounded-md focus:ring focus:ring-blue-300"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring focus:ring-blue-300"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {passwordStrength && (
                <p className={`mt-1 text-sm ${passwordStrength.color}`}>
                  Password strength: {passwordStrength.label}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring focus:ring-blue-300"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button className="bg-foreground text-white py-2 rounded-md w-full hover:bg-foreground/60">
              Sign Up
            </button>
            <p className="text-sm text-center">
              Already have an account?{" "}
              <span
                className="text-foreground cursor-pointer hover:underline"
                onClick={() => setIsLogin(true)}
              >
                Sign in
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

const Nav = () => {
  const pathname = usePathname();
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchResults, setSearchResults] = useState<Item[]>([]);

  const toggleOverlay = () => {
    setOverlayVisible(!isOverlayVisible);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser)
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};

    if (user != null) {
      const cartsCollectionRef = collection(fs, "carts");

      const q = query(
        cartsCollectionRef,
        where("customerId", "==", user.uid),
        where("status", "==", "cart")
      );

      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          if (!querySnapshot.empty) {
            const cartDoc = querySnapshot.docs[0];
            const items = cartDoc.data().items || [];

            const totalQuantity: number = items.reduce(
              (acc: number, item: { quantity: number }) => acc + item.quantity,
              0
            );
            setCartItemCount(totalQuantity);
          } else {
            setCartItemCount(0);
          }
        },
        (error) => {
          console.error("Error fetching cart item count: ", error);
        }
      );
    } else {
      setCartItemCount(0);
    }

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    let unsubscribe = () => {};

    if (user != null) {
      const usersRef = doc(fs, "users", user.uid);
      unsubscribe = onSnapshot(usersRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const notification: [
            string,
            string,
            "error" | "success" | "warning",
            boolean
          ] = data.notification || ["", "", "warning", true];
          const [title, message, type, shown] = notification;
          if (shown) return;

          toast(message, {
            duration: 5000,
            icon: icon[type],
          });

          setDoc(
            usersRef,
            {
              notification: [title, message, type, true],
            },
            { merge: true }
          );
        }
      });
    }

    return () => unsubscribe();
  }, [user]);

  const checkCart = () => {
    if (cartItemCount === 0) {
      toast.error("Your cart is empty");
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLInputElement>) => {
    const queryText = (e.target as HTMLInputElement).value;

    if (queryText.trim() !== "") {
      const menuCollectionRef = collection(fs, "menu");

      const unsubscribe = onSnapshot(
        menuCollectionRef,
        (querySnapshot) => {
          const allItems = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              sold: data.sold,
              name: data.name,
              description: data.description,
              price: data.price,
              imageURL: data.imageURL,
            } as Item;
          });

          const filteredResults = allItems
            .filter((item) =>
              item.name.toLowerCase().includes(queryText.toLowerCase())
            )
            .slice(0, 5);

          setSearchResults(filteredResults);
        },
        (error) => {
          console.error("Error fetching menu items: ", error);
        }
      );

      return () => unsubscribe();
    } else {
      setSearchResults([]);
    }
  };

  return (
    <>
      <nav className="absolute w-full inset-0 h-20 top-0 left-0 px-2 lg:px-20 flex justify-between py-4 items-center text-foreground">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src="/icon.png" alt="logo" width={50} height={50} />
          <h1 className="font-bold text-xl lg:flex hidden">TapLokal</h1>
        </Link>
        <div className="justify-between gap-5 items-center flex">
          <ul className="justify-between gap-10 text-base mr-10 hidden lg:flex">
            <li
              className={`cursor-pointer ${
                pathname == "/" ? "font-semibold" : "hover:font-semibold"
              }`}
            >
              <Link href={"/"}>Home</Link>
            </li>
            <li
              className={`cursor-pointer ${
                pathname == "/about" ? "font-semibold" : "hover:font-semibold"
              }`}
            >
              <Link href={"/about"}>About</Link>
            </li>
            <li
              className={`cursor-pointer ${
                pathname == "/#categories"
                  ? "font-semibold"
                  : "hover:font-semibold"
              }`}
            >
              <Link href={"/#categories"}>Browse menu</Link>
            </li>
          </ul>
          <li
            className={`cursor-pointer flex p-2 relative ${
              pathname === "/cart" ? "stroke-2" : "hover:stroke-2"
            } hover:shadow-2xl`}
          >
            <Link
              href={`${cartItemCount > 0 ? "/cart" : "/#"}`}
              onClick={checkCart}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p className="absolute top-0 right-0 bg-red-400 rounded-full text-background text-xs px-1">
                {cartItemCount}
              </p>
            </Link>
          </li>

          <div className="relative flex gap-2">
            <div className="bg-background text-foreground p-2 rounded-lg flex border">
              <input
                type="text"
                placeholder="Search here"
                onInput={handleSearch}
                className="outline-none w-28 lg:w-full"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <div
              className="p-2 bg-background text-foreground rounded-lg border cursor-pointer"
              onClick={user ? toggleDropdown : toggleOverlay}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            {isDropdownVisible && user && (
              <UserDropdown onClose={toggleDropdown} />
            )}
            {searchResults.length > 0 && (
              <div className="flex flex-col items-center py-2 px-1 lg:py-4 lg:px-2 absolute left-0 lg:top-10 top-16 w-full bg-white border rounded-lg shadow-lg z-20">
                {searchResults.map((searchResult, index) => (
                  <SearchItem key={index} item={searchResult} />
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
      {isOverlayVisible && <Overlay onClose={toggleOverlay} />}
    </>
  );
};

export default Nav;
